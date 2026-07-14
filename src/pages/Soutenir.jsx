import { useState, useEffect } from 'react';
import { Heart, Check, XCircle, Loader } from 'lucide-react';
import EdahabiaButton from '../components/payment/EdahabiaButton';

const PREDEFINED = [200, 500, 1000, 2000];
const DZD_TO_EUR = 145.50;

/** État de la page : 'form' | 'loading' | 'success' | 'failed' | 'canceled' */
export default function Soutenir() {
  const [selected, setSelected] = useState(500);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [donationCount, setDonationCount] = useState(0);

  /* Résultat vérifié du paiement */
  const [paymentResult, setPaymentResult] = useState(null); // { status, amount_dzd, ... }
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    /* Compteur des soutiens */
    fetch('/api/donations/count')
      .then(r => r.json())
      .then(d => setDonationCount(d.count || 0))
      .catch(() => {});

    /* Vérification côté serveur si retour de paiement */
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const ref = params.get('ref');

    if (success === 'true' && ref) {
      verifyPayment(ref);
    }
  }, []);

  async function verifyPayment(ref) {
    setVerifying(true);
    try {
      const res = await fetch(`/api/soutenir/verifier?ref=${encodeURIComponent(ref)}`);
      const data = await res.json();
      setPaymentResult(data);

      /* Nettoyer l'URL */
      window.history.replaceState({}, '', '/soutenir');
    } catch (err) {
      setPaymentResult({ status: 'error', error: err.message });
    } finally {
      setVerifying(false);
    }
  }

  const amountDZD = custom ? parseInt(custom) || 0 : selected;

  /* ── Écran de vérification ── */
  if (verifying) {
    return (
      <div className="soutenir-page">
        <div className="soutenir-hero">
          <Loader size={48} className="spin" />
          <h1>Vérification de votre soutien</h1>
          <p>Nous vérifions le statut de votre paiement auprès de Chargily...</p>
        </div>
      </div>
    );
  }

  /* ── Écran de succès (paiement vérifié côté serveur) ── */
  if (paymentResult?.status === 'completed' || paymentResult?.verified === true) {
    const date = paymentResult.created_at
      ? new Date(paymentResult.created_at + 'Z').toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })
      : new Date().toLocaleDateString('fr-FR');

    return (
      <div className="soutenir-page">
        <div className="soutenir-hero">
          <div className="success-icon">&#10004;</div>
          <h1>Merci pour votre soutien !</h1>
          <p className="success-subtitle">
            Votre don citoyen a bien été enregistré. Chaque contribution renforce notre action
            pour un Portail Citoyen au service de Bordj El Kiffan.
          </p>
        </div>

        <div className="soutenir-card success-card">
          <div className="receipt-row">
            <span className="receipt-label">Montant du soutien</span>
            <span className="receipt-value">{paymentResult.amount_dzd || amountDZD} DZD</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Date</span>
            <span className="receipt-value">{date}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Contribution</span>
            <span className="receipt-value">Soutien citoyen</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Statut</span>
            <span className="receipt-value receipt-success">Confirmé &#10004;</span>
          </div>

          <p className="receipt-footer">
            Ce soutien nous aide à maintenir et améliorer le Portail Citoyen de Bordj El Kiffan
            — une plateforme indépendante au service de tous les habitants de la commune.
          </p>
        </div>
      </div>
    );
  }

  /* ── Écran d'échec ── */
  if (paymentResult?.status === 'failed' || paymentResult?.status === 'canceled') {
    return (
      <div className="soutenir-page">
        <div className="soutenir-hero">
          <XCircle size={48} style={{ color: 'var(--clr-red-light)' }} />
          <h1>Paiement non abouti</h1>
          <p>
            Le paiement n&apos;a pas pu être complété. Ce n&apos;est pas un problème —
            vous pouvez réessayer quand vous le souhaitez.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
            onClick={() => setPaymentResult(null)}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /* ── Écran d'erreur de vérification ── */
  if (paymentResult?.status === 'error') {
    return (
      <div className="soutenir-page">
        <div className="soutenir-hero">
          <XCircle size={48} style={{ color: 'var(--clr-red-light)' }} />
          <h1>Vérification impossible</h1>
          <p>Impossible de vérifier le statut du paiement. Contactez-nous si le problème persiste.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
            onClick={() => setPaymentResult(null)}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  /* ── Formulaire de don (état par défaut) ── */
  return (
    <div className="soutenir-page">
      <div className="soutenir-hero">
        <Heart size={48} />
        <h1>Soutenez le Portail Citoyen</h1>
        <p>
          Votre soutien, même modeste, nous aide à développer et maintenir cette plateforme
          citoyenne indépendante pour Bordj El Kiffan.
        </p>
        {donationCount > 0 && (
          <p className="donation-count">
            <Check size={16} /> {donationCount} citoyens ont déjà soutenu le projet
          </p>
        )}
      </div>

      <div className="soutenir-card">
        <h2>Choisissez votre montant de soutien</h2>
        <div className="amount-grid">
          {PREDEFINED.map(a => (
            <button
              key={a}
              onClick={() => { setSelected(a); setCustom(''); }}
              className={`amount-btn ${selected === a && !custom ? 'active' : ''}`}
            >
              {a} دج
              <small>~{Math.round(a / DZD_TO_EUR)} €</small>
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <label>Montant personnalisé (minimum 100 DZD)</label>
          <input
            type="number"
            min="100"
            max="500000"
            placeholder="Montant en DZD"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(0); }}
          />
        </div>

        <div className="form-group">
          <label>Votre nom (optionnel, pour le reçu)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Anonyme" />
        </div>

        <div className="form-group">
          <label>Message (optionnel)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Un mot pour l'équipe..." rows={3} />
        </div>

        {amountDZD >= 100 && (
          <p className="conversion-note">
            Paiement sécurisé par <strong>Carte Edahabia</strong> (Algérie Poste) ou
            {' '}<strong>CIB</strong> — Montant en DZD. Vous serez redirigé vers
            {' '}<strong>Chargily Pay</strong> pour le paiement.
          </p>
        )}

        <EdahabiaButton
          amountDZD={amountDZD}
          supporterName={name}
          message={message}
        />

        {amountDZD >= 100 && (
          <p className="ccp-note" style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-500)', textAlign: 'center' }}>
            Ce paiement est un don de soutien citoyen, pas une facture de service public.
          </p>
        )}
      </div>
    </div>
  );
}
