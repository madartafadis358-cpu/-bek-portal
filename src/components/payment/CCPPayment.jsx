import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CCP_INFO = {
  rib: '007 99999 0000853685 48',
  beneficiary: 'BRIK CHAOUCHE MOURAD',
  bank: 'Algérie Poste — CCP',
};

export default function CCPPayment({ amountDZD, label, supporterName, message }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CCP_INFO.rib);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = CCP_INFO.rib;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="ccp-payment">
      <div className="ccp-header">
        <span className="ccp-icon">🏦</span>
        <span>Paiement par CCP (Algérie Poste)</span>
      </div>

      <div className="ccp-info">
        <div className="ccp-row">
          <span className="ccp-label">Bénéficiaire</span>
          <span className="ccp-value">{CCP_INFO.beneficiary}</span>
        </div>
        <div className="ccp-row">
          <span className="ccp-label">RIB / CCP</span>
          <span className="ccp-value ccp-rib">{CCP_INFO.rib}</span>
        </div>
        <div className="ccp-row">
          <span className="ccp-label">Banque</span>
          <span className="ccp-value">{CCP_INFO.bank}</span>
        </div>
        {amountDZD >= 50 && (
          <div className="ccp-row">
            <span className="ccp-label">Montant</span>
            <span className="ccp-value ccp-amount">{amountDZD} دج</span>
          </div>
        )}
      </div>

      <button onClick={handleCopy} className="ccp-copy-btn">
        {copied ? <><Check size={18} /> RIB copié !</> : <><Copy size={18} /> Copier le RIB</>}
      </button>

      <p className="ccp-note">
        Effectuez le virement sur ce CCP depuis votre application Baridimob ou en bureau de poste.
        Le paiement sera vérifié manuellement par notre équipe.
      </p>
    </div>
  );
}
