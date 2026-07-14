import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { initDb, queryAll, queryById, queryWhere, insertRow, updateRow, updateRowByCheckout, deleteRow, countWhere, queryRaw } from './api/_lib/database.js';
import { getChargilyBaseUrl, getChargilyHeaders } from './api/_lib/chargily.js';
import { createCheckout, getCheckout, verifyWebhookSignature, MIN_AMOUNT, MAX_AMOUNT } from './api/services/chargilyClient.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET must be set in .env');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

const ALLOWED_COLUMNS = ['id', 'created_at', 'titre', 'date', 'name', 'amount_dzd', 'status', 'description', 'quartier', 'categorie', 'votes', 'statut', 'avancement', 'benevoles', 'username', 'role', 'plan_type', 'placement', 'title', 'start_date', 'end_date'];

function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' })[c]);
}

function sanitizeBody(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === 'string' ? sanitize(v) : v;
  }
  return out;
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

/* ── Webhook Chargily (raw body — must be before express.json) ── */
app.post('/api/chargily/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['signature'];

  if (!signature) {
    console.warn('[Webhook] Signature manquante');
    return res.status(400).json({ error: 'Signature manquante' });
  }

  let isValid = false;
  try {
    isValid = verifyWebhookSignature(req.body, signature);
  } catch (e) {
    console.warn('[Webhook] Erreur vérification signature:', e.message);
  }

  if (!isValid) {
    console.warn('[Webhook] Signature invalide reçue');
    return res.status(403).json({ error: 'Signature invalide' });
  }

  try {
    const event = JSON.parse(req.body.toString());
    const checkout = event.data;
    console.log(`[Webhook] Reçu: ${event.type} | checkout=${checkout?.id} | montant=${checkout?.amount}`);

    switch (event.type) {
      case 'checkout.paid': {
        const meta = checkout.metadata || {};
        console.log(`[Webhook] Paiement réussi pour ${meta.type || 'donation'}`);

        updateRowByCheckout('donations', checkout.id, { status: 'completed' });

        if (meta.type === 'user_premium') {
          updateRowByCheckout('subscriptions', checkout.id, { status: 'active' });
        }
        if (meta.type === 'business_premium') {
          updateRow('businesses', Number(meta.business_id), { is_premium: 1 });
        }
        if (meta.type === 'ad_campaign') {
          const today = new Date().toISOString().split('T')[0];
          const end = new Date();
          end.setDate(end.getDate() + 30);
          updateRow('ad_campaigns', Number(meta.ad_id), { is_active: 1, start_date: today, end_date: end.toISOString().split('T')[0] });
        }
        break;
      }
      case 'checkout.failed': {
        console.log(`[Webhook] Paiement échoué: ${checkout?.id}`);
        updateRowByCheckout('donations', checkout.id, { status: 'failed' });
        updateRowByCheckout('subscriptions', checkout.id, { status: 'canceled' });
        break;
      }
      case 'checkout.canceled': {
        console.log(`[Webhook] Paiement annulé: ${checkout?.id}`);
        updateRowByCheckout('donations', checkout.id, { status: 'canceled' });
        updateRowByCheckout('subscriptions', checkout.id, { status: 'canceled' });
        break;
      }
      default:
        console.log(`[Webhook] Type ignoré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Erreur traitement:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DIST = path.join(__dirname, 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token requis' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token invalide' });
  }
}

const ALLOWED_TABLES = ['signalements', 'propositions', 'entraide', 'membres', 'projets', 'actualites', 'donations', 'subscriptions', 'businesses', 'ad_campaigns'];

app.get('/api/data/:table', (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Table invalide' });
  try {
    const { order, orderDir } = req.query;

    const safeOrder = order && ALLOWED_COLUMNS.includes(order) ? order : 'id';
    const safeDir = orderDir === 'asc' ? 'ASC' : 'DESC';
    const orderBy = `${safeOrder} ${safeDir}`;

    const filters = {};
    for (const [key, val] of Object.entries(req.query)) {
      if (key !== 'order' && key !== 'orderDir' && key !== '_t') {
        filters[key] = val;
      }
    }

    let data;
    if (Object.keys(filters).length > 0) {
      data = queryWhere(table, filters, orderBy);
    } else {
      data = queryAll(table, orderBy);
    }
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/data/:table', (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Table invalide' });
  try {
    const record = insertRow(table, sanitizeBody(req.body));
    res.status(201).json({ data: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/data/:table/:id', (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Table invalide' });
  try {
    const record = updateRow(table, Number(id), req.body);
    res.json({ data: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/data/:table/:id', (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Table invalide' });
  try {
    deleteRow(table, Number(id));
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/donations/count', (req, res) => {
  try {
    const count = countWhere('donations', { status: 'completed' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Rate limiter for checkout creation ── */
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

/**
 * POST /api/soutenir/checkout
 *
 * Crée un checkout Chargily pour un don de soutien citoyen.
 * Body: { amountDZD, supporterName?, message? }
 * Response: { checkoutUrl, checkoutId }
 */
app.post('/api/soutenir/checkout', checkoutLimiter, async (req, res) => {
  try {
    const { amountDZD, supporterName, message } = req.body;

    /* Validation montant côté serveur ⚠️ (ne jamais faire confiance au client) */
    const amount = parseInt(amountDZD);
    if (!amount || isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return res.status(400).json({
        error: `Le montant doit être compris entre ${MIN_AMOUNT} et ${MAX_AMOUNT.toLocaleString()} DZD`,
      });
    }

    const clientOrigin = req.headers.origin || 'https://bek-portal.onrender.com';
    const description = message
      ? `Don de soutien - Portail Citoyen Bordj El Kiffan - ${amount} DZD`
      : `Don de soutien - Portail Citoyen Bordj El Kiffan`;

    /* Création du checkout via Chargily API */
    const checkout = await createCheckout({
      amount,
      success_url: `${clientOrigin}/soutenir?success=true&checkout_id=${Date.now()}`,
      failure_url: `${clientOrigin}/soutenir?canceled=true`,
      description,
      locale: 'fr',
      metadata: {
        type: 'donation',
        supporter_name: supporterName || 'Anonyme',
        raw_message: message || '',
      },
    });

    /* Sauvegarde en base */
    const donation = insertRow('donations', {
      amount_dzd: amount,
      amount_eur: 0,
      currency: 'dzd',
      chargily_checkout_id: checkout.id,
      status: 'pending',
      supporter_name: supporterName || null,
      message: message || null,
    });

    console.log(`[Soutenir] Checkout créé: ${checkout.id} | ${amount} DZD | ${supporterName || 'Anonyme'}`);
    res.json({ checkoutUrl: checkout.checkout_url, checkoutId: checkout.id });
  } catch (err) {
    console.error('[Soutenir] Erreur création checkout:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/soutenir/verifier?checkout_id=xxx
 *
 * Vérifie le statut réel d'un checkout auprès de l'API Chargily.
 * Cela évite de se fier uniquement au paramètre "success=true" dans l'URL
 * qui peut être falsifié par l'utilisateur.
 *
 * Response: { status, amount, supporter_name, created_at }
 */
app.get('/api/soutenir/verifier', async (req, res) => {
  try {
    const { checkout_id } = req.query;
    if (!checkout_id) return res.status(400).json({ error: 'checkout_id requis' });

    /* 1. Vérifier via l'API Chargily */
    let chargilyStatus = null;
    try {
      const remoteCheckout = await getCheckout(checkout_id);
      chargilyStatus = remoteCheckout.status;
    } catch (e) {
      console.warn('[Soutenir] API Chargily indisponible pour vérification:', e.message);
    }

    /* 2. Vérifier dans notre base */
    const donations = queryWhere('donations', { chargily_checkout_id: checkout_id });
    const donation = donations.length > 0 ? donations[0] : null;

    if (!donation) {
      return res.json({ status: 'not_found', verified: false });
    }

    /* 3. Déterminer le statut final : priorité à l'API Chargily */
    const finalStatus = chargilyStatus === 'paid' ? 'completed'
      : chargilyStatus === 'failed' ? 'failed'
      : chargilyStatus === 'canceled' ? 'canceled'
      : donation.status;

    /* Si le statut Chargily indique paid et notre base dit pending, on synchronise */
    if (chargilyStatus === 'paid' && donation.status === 'pending') {
      updateRowByCheckout('donations', checkout_id, { status: 'completed' });
    }

    res.json({
      status: finalStatus,
      verified: chargilyStatus === 'paid' || donation.status === 'completed',
      amount_dzd: donation.amount_dzd,
      supporter_name: donation.supporter_name,
      currency: donation.currency,
      created_at: donation.created_at,
      webhook_verified: chargilyStatus,
    });
  } catch (err) {
    console.error('[Soutenir] Erreur vérification:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/business/register', (req, res) => {
  try {
    const data = queryRaw('SELECT id, name, category, address, phone, description, hours, website, is_premium FROM businesses ORDER BY is_premium DESC, name ASC');
    res.json({ businesses: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/business/register', async (req, res) => {
  try {
    const { name, category, address, phone, description, hours, website, isPremium } = sanitizeBody(req.body);
    if (!name || !category) return res.status(400).json({ error: 'Nom et catégorie requis' });

    const business = insertRow('businesses', { name, category, address, phone, description, hours, website, is_premium: 0 });

    if (isPremium) {
      const checkoutPayload = {
        amount: 1500,
        currency: 'dzd',
        success_url: `${req.headers.origin}/annuaire?success=true`,
        failure_url: `${req.headers.origin}/annuaire?canceled=true`,
        description: 'Abonnement Premium Partenaire - Bek-Portal',
        locale: 'fr',
        webhook_endpoint: `${APP_URL}/api/chargily/webhook`,
        metadata: { type: 'business_premium', business_id: business.id.toString() },
      };

      const response = await fetch(`${getChargilyBaseUrl()}/checkouts`, {
        method: 'POST',
        headers: getChargilyHeaders(),
        body: JSON.stringify(checkoutPayload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur Chargily');
      return res.json({ business, checkoutUrl: data.checkout_url });
    }

    res.json({ business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/ads', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { placement } = req.query;
    const data = queryRaw(
      `SELECT id, title, image_url, link_url, placement, is_active, start_date, end_date FROM ad_campaigns WHERE is_active = 1 AND start_date <= ? AND end_date >= ?${placement ? ' AND placement = ?' : ''} ORDER BY created_at DESC`,
      placement ? [today, today, placement] : [today, today]
    );
    res.json({ ads: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/ads', authMiddleware, (req, res) => {
  try {
    const { title, image_url, link_url, placement, start_date, end_date } = sanitizeBody(req.body);
    if (!title || !image_url || !placement || !start_date || !end_date) {
      return res.status(400).json({ error: 'Tous les champs requis' });
    }
    const ad = insertRow('ad_campaigns', { title, image_url, link_url, placement, start_date, end_date, is_active: 1 });
    res.status(201).json({ ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/ads', authMiddleware, (req, res) => {
  try {
    const { id } = req.query;
    deleteRow('ad_campaigns', Number(id));
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chargily/create-checkout', async (req, res) => {
  try {
    const { amountDZD, supporterName, message } = sanitizeBody(req.body);
    if (!amountDZD || amountDZD < 50) return res.status(400).json({ error: 'Montant minimum : 50 دج' });

    const checkoutPayload = {
      amount: amountDZD,
      currency: 'dzd',
      success_url: `${req.headers.origin}/soutenir?success=true`,
      failure_url: `${req.headers.origin}/soutenir?canceled=true`,
      description: message || `Soutien Bek-Portal - ${amountDZD} دج`,
      locale: 'fr',
      webhook_endpoint: `${req.headers.origin}/api/chargily/webhook`,
      metadata: { type: 'donation', supporter_name: supporterName || 'Anonyme' },
    };

    const response = await fetch(`${getChargilyBaseUrl()}/checkouts`, {
      method: 'POST',
      headers: getChargilyHeaders(),
      body: JSON.stringify(checkoutPayload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur Chargily');

    insertRow('donations', {
      amount_dzd: amountDZD,
      amount_eur: 0,
      currency: 'dzd',
      chargily_checkout_id: data.id,
      status: 'pending',
      supporter_name: supporterName || null,
      message: message || null,
    });

    res.json({ checkoutUrl: data.checkout_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PRICES = {
  monthly: { dzd: 800, label: 'Premium Mensuel' },
  yearly: { dzd: 8000, label: 'Premium Annuel' },
};

app.post('/api/chargily/create-checkout-session', async (req, res) => {
  try {
    const { planType, userId } = req.body;
    if (!planType || !PRICES[planType]) return res.status(400).json({ error: "Type d'abonnement invalide" });

    const plan = PRICES[planType];
    const checkoutPayload = {
      amount: plan.dzd,
      currency: 'dzd',
      success_url: `${req.headers.origin}/premium?success=true`,
      failure_url: `${req.headers.origin}/premium?canceled=true`,
      description: `Abonnement ${plan.label} - Bek-Portal`,
      locale: 'fr',
      webhook_endpoint: `${req.headers.origin}/api/chargily/webhook`,
      metadata: { type: 'user_premium', plan_type: planType, user_id: userId || 'anonymous' },
    };

    const response = await fetch(`${getChargilyBaseUrl()}/checkouts`, {
      method: 'POST',
      headers: getChargilyHeaders(),
      body: JSON.stringify(checkoutPayload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur Chargily');

    if (userId) {
      insertRow('subscriptions', { user_id: userId, chargily_checkout_id: data.id, plan_type: planType, status: 'pending' });
    }

    res.json({ checkoutUrl: data.checkout_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const AD_PRICES = { sidebar: 500, header: 1000, inline: 300 };

app.post('/api/chargily/ad-checkout', async (req, res) => {
  try {
    const { title, image_url, link_url, placement } = req.body;
    if (!title || !image_url || !placement) return res.status(400).json({ error: 'Titre, image et emplacement requis' });
    const price = AD_PRICES[placement];
    if (!price) return res.status(400).json({ error: 'Emplacement invalide' });
    const today = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const endDate = end.toISOString().split('T')[0];

    const ad = insertRow('ad_campaigns', {
      title, image_url, link_url, placement,
      start_date: today, end_date: endDate,
      is_active: 0,
    });

    let checkoutUrl = null;
    const clientOrigin = req.headers.origin || 'http://localhost:3000';
    try {
      const checkoutPayload = {
        amount: price,
        currency: 'dzd',
        success_url: `${clientOrigin}/admin/ads?success=true`,
        failure_url: `${clientOrigin}/admin/ads?canceled=true`,
        description: `Publicité ${placement} - ${title} - Bek-Portal`,
        locale: 'fr',
        webhook_endpoint: `${APP_URL}/api/chargily/webhook`,
        metadata: { type: 'ad_campaign', ad_id: ad.id.toString() },
      };

      const response = await fetch(`${getChargilyBaseUrl()}/checkouts`, {
        method: 'POST',
        headers: getChargilyHeaders(),
        body: JSON.stringify(checkoutPayload),
      });

      const data = await response.json();
      if (response.ok) {
        updateRow('ad_campaigns', ad.id, { chargily_checkout_id: data.id });
        checkoutUrl = data.checkout_url;
      }
    } catch (e) {
      console.error('[Ad] Chargily API error:', e.message);
    }

    res.json({ ad, checkoutUrl, message: checkoutUrl ? 'Redirection vers le paiement' : 'Annonce créée. Paiement non disponible pour le moment.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/admin/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password) return res.status(400).json({ error: 'Mot de passe requis' });

    const admins = queryAll('admins');

    /* Premier démarrage : création du superadmin avec le mot de passe ADMIN_PASSWORD */
    if (admins.length === 0) {
      const defaultPass = process.env.ADMIN_PASSWORD || 'MBC10101971';
      const hash = await bcrypt.hash(defaultPass, 10);
      insertRow('admins', { username: 'superadmin', password_hash: hash, role: 'superadmin' });
    }

    /* Authentification par nom d'utilisateur + mot de passe */
    const loginName = username || 'superadmin';
    const admin = queryWhere('admins', { username: loginName })[0];
    if (!admin) return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });

    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: admin.id, username: admin.username, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/check', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.get('/api/admin/users', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Accès réservé au super admin' });
    const admins = queryAll('admins', 'id ASC');
    res.json({ admins: admins.map(a => ({ id: a.id, username: a.username, role: a.role, created_at: a.created_at })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Accès réservé au super admin' });
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    const hash = await bcrypt.hash(password, 10);
    const admin = insertRow('admins', { username, password_hash: hash, role: role || 'admin' });
    res.status(201).json({ admin: { id: admin.id, username: admin.username, role: admin.role, created_at: admin.created_at } });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Nom d\'utilisateur déjà pris' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Accès réservé au super admin' });
    const target = queryById('admins', Number(req.params.id));
    if (!target) return res.status(404).json({ error: 'Admin introuvable' });
    if (target.role === 'superadmin') return res.status(403).json({ error: 'Impossible de supprimer le super admin' });
    deleteRow('admins', Number(req.params.id));
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  next();
});

async function start() {
  try {
    await initDb();

    let admins = queryAll('admins');
    if (admins.length === 0) {
      const pass = process.env.ADMIN_PASSWORD || 'MBC10101971';
      const hash = await bcrypt.hash(pass, 10);
      insertRow('admins', { username: 'superadmin', password_hash: hash, role: 'superadmin' });
      admins = queryAll('admins');
      console.log('[Server] Super admin created');
    }

    app.listen(PORT, () => {
      console.log(`[Server] BEK Portal running on http://localhost:${PORT}`);
      console.log(`[Server] API: http://localhost:${PORT}/api/data/`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('[Server] Shutting down gracefully...');
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('[Server] Shutting down gracefully...');
  process.exit(0);
});

start();
