# Création compte Stripe — Instructions

## URL : https://dashboard.stripe.com/register (avec VPN France/Belgique)

### 1. Email & Mot de passe
- Email : (ton email)
- Nom complet : (ton nom)
- Mot de passe : (choisis)

### 2. Pays
- Sélectionne **France** (pays du compte)
- Stripe n'est PAS disponible en Algérie, donc obligé de prendre France

### 3. Type d'activité
- **Entreprise individuelle** (si tu es seul)
- Site web : `https://bek-portal.vercel.app`
- Description : "Portail citoyen BEK — dons, annuaire commerces, abonnements"

### 4. Informations personnelles
- Numéro de téléphone français ? Tu peux mettre un texte +213
- IBAN : il faudra un IBAN français (Revolut, N26, Wise) pour recevoir les paiements
- Date de naissance, adresse

### 5. Après création
Tu recevras deux clés API :
- **Publishable Key** (pk_live_...) → à mettre dans `VITE_STRIPE_PUBLISHABLE_KEY`
- **Secret Key** (sk_live_...) → à mettre dans `STRIPE_SECRET_KEY`

### 6. Webhook
Dans Stripe Dashboard > Developers > Webhooks > Add endpoint :
- URL : `https://bek-portal.vercel.app/api/stripe/webhook`
- Events : `checkout.session.completed`, `customer.subscription.updated`
- Récupérer le **Webhook Secret** (whsec_...) → `STRIPE_WEBHOOK_SECRET`

Tu me donnes les clés et je configure tout dans Vercel.
