import { BadgeCheck } from 'lucide-react';

export default function PartnerCard({ business }) {
  return (
    <div className="partner-card">
      <span className="premium-badge"><BadgeCheck size={14} /> Partenaire Officiel</span>
      <h4>{business.name}</h4>
      <span className="category-tag">{business.category}</span>
      {business.address && <p className="info">📍 {business.address}</p>}
      {business.phone && <p className="info">📞 {business.phone}</p>}
      {business.hours && <p className="info">🕐 {business.hours}</p>}
    </div>
  );
}
