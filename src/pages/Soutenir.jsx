import { useState, useEffect } from 'react';
import { Heart, Check } from 'lucide-react';
import EdahabiaButton from '../components/payment/EdahabiaButton';

const PREDEFINED = [200, 500, 1000, 2000];
const DZD_TO_EUR = 145.50;

export default function Soutenir() {
  const [selected, setSelected] = useState(500);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [donationCount, setDonationCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/donations/count')
      .then(r => r.json())
      .then(d => setDonationCount(d.count || 0))
      .catch(() => {});
    if (window.location.search.includes('success=true')) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }
  }, []);

  const amountDZD = custom ? parseInt(custom) || 0 : selected;

  return (
    <div className="soutenir-page">
      <div className="soutenir-hero">
        <Heart size={48} />
        <h1>Soutenez Bek-Portal</h1>
        <p>Aidez-nous à faire de Bordj El Kiffan une commune modèle.</p>
        {donationCount > 0 && (
          <p className="donation-count">
            <Check size={16} /> {donationCount} citoyens ont déjà soutenu le projet
          </p>
        )}
      </div>

      {isSuccess && (
        <div className="success-banner">
          Merci pour votre soutien ! Votre contribution compte énormément. ❤️
        </div>
      )}

      <div className="soutenir-card">
        <h2>Choisissez un montant</h2>
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
          <label>Montant personnalisé</label>
          <input
            type="number"
            min="50"
            placeholder="Montant en DZD"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(0); }}
          />
        </div>

        <div className="form-group">
          <label>Votre nom (optionnel)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Anonyme" />
        </div>

        <div className="form-group">
          <label>Message (optionnel)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Un mot pour l'équipe..." rows={3} />
        </div>

        {amountDZD >= 50 && (
          <p className="conversion-note">
            Paiement sécurisé par Carte Edahabia (Algérie Poste) — Montant en DZD.
          </p>
        )}

        <EdahabiaButton
          amountDZD={amountDZD}
          supporterName={name}
          message={message}
        />
      </div>
    </div>
  );
}
