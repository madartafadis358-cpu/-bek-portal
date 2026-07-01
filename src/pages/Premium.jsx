import { useState, useEffect } from 'react';
import { Crown, Check, BarChart3, Bell, FileText, CreditCard, Landmark } from 'lucide-react';
import CCPPayment from '../components/payment/CCPPayment';

const PLANS = [
  { type: 'monthly', label: 'Mensuel', dzd: 800, features: ['Statistiques avancées du quartier', 'Alertes prioritaires', 'Export de rapports PDF', 'Badge Premium'] },
  { type: 'yearly', label: 'Annuel', dzd: 8000, features: ['Tout le plan Mensuel', '2 mois offerts', 'Support prioritaire'], popular: true },
];

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('chargily');

  useEffect(() => {
    if (window.location.search.includes('success=true')) {
      setIsSuccess(true); /* eslint-disable-line react-hooks/set-state-in-effect */
      setTimeout(() => setIsSuccess(false), 5000);
    }
  }, []);

  async function handleSubscribe(planType) {
    setLoading(true);
    try {
      const res = await fetch('/api/chargily/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, userId: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.assign(data.checkoutUrl);
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="premium-page">
      <div className="premium-hero">
        <Crown size={48} />
        <h1>Passer en Premium</h1>
        <p>Accédez à des fonctionnalités exclusives pour suivre et améliorer votre quartier.</p>
      </div>

      {isSuccess && (
        <div className="success-banner">
          Bienvenue Premium ! Vous avez maintenant accès à toutes les fonctionnalités. 🎉
        </div>
      )}

      <div className="features-preview">
        <div className="feature-item"><BarChart3 size={24} /><span>Statistiques avancées du quartier</span></div>
        <div className="feature-item"><Bell size={24} /><span>Alertes prioritaires par email</span></div>
        <div className="feature-item"><FileText size={24} /><span>Export de rapports en PDF</span></div>
      </div>

      <div className="plans-grid">
        {PLANS.map(plan => (
          <div key={plan.type} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <span className="popular-badge">Le plus populaire</span>}
            <h3>{plan.label}</h3>
            <p className="price">{plan.dzd} <span className="currency">دج</span></p>
            <p className="price-sub">{plan.type === 'yearly' ? '~667 دج/mois' : '/mois'}</p>
            <ul>
              {plan.features.map((f, i) => (
                <li key={i}><Check size={16} /> {f}</li>
              ))}
            </ul>
            <button
              onClick={() => { setSelectedPlan(plan); setPaymentMethod('chargily'); }}
              className={`btn-subscribe ${selectedPlan?.type === plan.type ? 'selected' : ''}`}
            >
              {selectedPlan?.type === plan.type ? 'Sélectionné' : `Choisir ${plan.label}`}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="premium-payment-section">
          <h3>Paiement pour {selectedPlan.label} — {selectedPlan.dzd} دج</h3>

          <div className="payment-method-selector">
            <button
              className={`pm-btn ${paymentMethod === 'chargily' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('chargily')}
            >
              <CreditCard size={20} /> Carte bancaire
            </button>
            <button
              className={`pm-btn ${paymentMethod === 'ccp' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('ccp')}
            >
              <Landmark size={20} /> Virement CCP
            </button>
          </div>

          {paymentMethod === 'chargily' ? (
            <>
              <p className="payment-note">
                Paiement sécurisé par CIB / Edahabia (Algérie) — Montant en DZD.
              </p>
              <button
                onClick={() => handleSubscribe(selectedPlan.type)}
                disabled={loading}
                className="btn-subscribe btn-subscribe-large"
              >
                {loading ? 'Redirection...' : `S'abonner ${selectedPlan.label}`}
              </button>
            </>
          ) : (
            <CCPPayment amountDZD={selectedPlan.dzd} />
          )}
        </div>
      )}
    </div>
  );
}
