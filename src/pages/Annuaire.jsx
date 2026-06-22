import { useState, useEffect } from 'react';
import { Store, BadgeCheck, Search } from 'lucide-react';

const CATEGORIES = ['Tous', 'Restaurant', 'Café', 'Pharmacie', 'Superette', 'Garage', 'Boulangerie', 'Autre'];

export default function Annuaire() {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Autre', address: '', phone: '', description: '', hours: '', website: '', isPremium: false });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/business/register')
      .then(r => r.json())
      .then(d => setBusinesses(d.businesses || []))
      .catch(() => {});
    if (window.location.search.includes('success=true')) {
      setIsSuccess(true); /* eslint-disable-line react-hooks/set-state-in-effect */
      setTimeout(() => setIsSuccess(false), 5000);
    }
  }, []);

  const filtered = businesses.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Tous' || b.category === category;
    return matchSearch && matchCat;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setShowForm(false);
        setBusinesses(prev => [data.business, ...prev]);
      }
    } catch (err) {
      alert('Erreur : ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="annuaire-page">
      <div className="annuaire-hero">
        <Store size={48} />
        <h1>Annuaire des Commerces</h1>
        <p>Trouvez les commerces et services de Bordj El Kiffan.</p>
      </div>

      {isSuccess && (
        <div className="success-banner">
          Inscription réussie ! Bienvenue parmi les partenaires. 🎉
        </div>
      )}

      <div className="annuaire-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Rechercher un commerce..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="category-filters">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`cat-btn ${category === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-register">
          {showForm ? 'Fermer' : '+ Inscrire mon commerce'}
        </button>
      </div>

      {showForm && (
        <form className="business-form" onSubmit={handleSubmit}>
          <h3>Inscrire mon commerce</h3>
          <div className="form-row">
            <input placeholder="Nom du commerce *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <input placeholder="Adresse" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            <input placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
          <div className="form-row">
            <input placeholder="Horaires (ex: 8h-19h)" value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} />
            <input placeholder="Site web (optionnel)" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
          </div>
          <label className="premium-check">
            <input type="checkbox" checked={form.isPremium} onChange={e => setForm({...form, isPremium: e.target.checked})} />
            <span>Passer en <strong>Premium Partenaire</strong> (1 500 دج/mois) — Badge officiel + mise en avant</span>
          </label>
          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? 'Inscription...' : (form.isPremium ? 'S\'abonner Premium' : 'Inscription gratuite')}
          </button>
        </form>
      )}

      <div className="businesses-grid">
        {filtered.length === 0 && <p className="empty">Aucun commerce trouvé.</p>}
        {filtered.map(b => (
          <div key={b.id} className={`business-card ${b.is_premium ? 'premium' : ''}`}>
            {b.is_premium && <span className="premium-badge"><BadgeCheck size={16} /> Partenaire Officiel</span>}
            <h3>{b.name}</h3>
            <span className="category-tag">{b.category}</span>
            {b.address && <p className="info">📍 {b.address}</p>}
            {b.phone && <p className="info">📞 {b.phone}</p>}
            {b.hours && <p className="info">🕐 {b.hours}</p>}
            {b.description && <p className="desc">{b.description}</p>}
            {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="website-link">🌐 Site web</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
