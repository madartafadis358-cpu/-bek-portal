import { useState } from 'react';

export default function EdahabiaButton({ amountDZD, label, supporterName, message, className = '' }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/chargily/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountDZD, supporterName, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      alert('Erreur : ' + err.message);
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={`btn btn-primary ${className}`.trim()} style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}>
      {loading ? 'Redirection vers Chargily...' : (label || `Payer ${amountDZD} دج par Carte Edahabia`)}
    </button>
  );
}
