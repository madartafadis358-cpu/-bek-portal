import { useState } from 'react';

/**
 * Bouton de paiement unique — redirige vers Chargily Pay (Carte Edahabia / CIB).
 *
 * Appelle POST /api/soutenir/checkout qui crée un checkout via l'API Chargily v2.
 * Le checkout_url reçu redirige l'utilisateur vers la page sécurisée de paiement.
 *
 * @param {{ amountDZD: number, label?: string, supporterName?: string, message?: string }} props
 */
export default function EdahabiaButton({ amountDZD, label, supporterName, message }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!amountDZD || amountDZD < 100) {
      alert('Le montant minimum est de 100 DZD');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/soutenir/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountDZD,
          supporterName: supporterName || undefined,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }

      /* Redirection vers Chargily Pay */
      window.location.href = data.checkoutUrl;
    } catch (err) {
      alert('Erreur : ' + err.message);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn btn-primary"
      style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
    >
      {loading
        ? 'Redirection vers le paiement sécurisé...'
        : (label || `Soutenir avec ${amountDZD} دج (Carte Edahabia / CIB)`)}
    </button>
  );
}
