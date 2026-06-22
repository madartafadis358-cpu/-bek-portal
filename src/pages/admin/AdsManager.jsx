import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

const PLANS = [
  { placement: 'sidebar', label: 'Sidebar', price: 500, desc: 'Bannière latérale sur toutes les pages', period: '30 jours' },
  { placement: 'header', label: 'Header', price: 1000, desc: 'Bannière en haut de toutes les pages', period: '30 jours' },
  { placement: 'inline', label: 'Entre les articles', price: 300, desc: 'Annonce entre les contenus', period: '30 jours' },
];

export default function AdsManager() {
  const [ads, setAds] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ title: '', image_url: '', link_url: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('success') ? '✅ Paiement réussi ! Votre annonce est en ligne.' : '';
  });
  const { state } = useApp();
  const isAdmin = state.user?.role === 'admin';

  useEffect(() => {
    if (msg) window.history.replaceState({}, '', window.location.pathname);
    fetch('/api/admin/ads')
      .then(r => r.json())
      .then(d => setAds(d.ads || []))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePay(e) {
    e.preventDefault();
    if (!selectedPlan) return setMsg('Sélectionnez un emplacement');
    if (!form.title || !form.image_url) return setMsg('Titre et image requis');
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/chargily/ad-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          image_url: form.image_url,
          link_url: form.link_url || '',
          placement: selectedPlan.placement,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setMsg('Annonce créée ! Le paiement sera disponible une fois la clé API Chargily configurée.');
        setSelectedPlan(null);
        setForm({ title: '', image_url: '', link_url: '' });
        setAds(prev => data.ad ? [data.ad, ...prev] : prev);
      }
    } catch (err) {
      setMsg('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette publicité ?')) return;
    try {
      await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
      setAds(prev => prev.filter(a => a.id !== id));
    } catch { /* ignore */ }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Faites la différence</span>
        <h2>Publicité sur BEK</h2>
        <div className="divider" />
        <p>Promouvez votre activité ou votre événement auprès des citoyens de Bordj El Kiffan. Paiement sécurisé par CIB / Edahabia.</p>
      </div>

      {msg && <div className="alert alert-danger" style={{ textAlign: 'center', marginBottom: '1rem' }}>{msg}</div>}

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {PLANS.map(p => (
          <div
            key={p.placement}
            className={`card ${selectedPlan?.placement === p.placement ? 'card-selected' : ''}`}
            style={{ cursor: 'pointer', border: selectedPlan?.placement === p.placement ? '2px solid var(--clr-green-glow)' : '1px solid var(--glass-border)', textAlign: 'center', padding: '2rem 1.5rem' }}
            onClick={() => { setSelectedPlan(p); setMsg(''); }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-green-glow)' }}>{p.price} <small style={{ fontSize: '0.9rem' }}>DZD</small></div>
            <h3 style={{ margin: '0.75rem 0 0.25rem' }}>{p.label}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', margin: 0 }}>{p.desc}</p>
            <small style={{ color: 'var(--text-500)' }}>{p.period}</small>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1rem' }}>{selectedPlan ? `Créez votre annonce (${selectedPlan.label})` : 'Sélectionnez un emplacement'}</h3>
        <form onSubmit={handlePay}>
          <div className="form-group">
            <label>Titre de l'annonce *</label>
            <input className="form-control" placeholder="Ex: Boutique El Khir" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>URL de l'image *</label>
            <input className="form-control" placeholder="https://exemple.com/mon-image.jpg" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>URL du lien (optionnel)</label>
            <input className="form-control" placeholder="https://exemple.com" value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading || !selectedPlan}>
            {loading ? 'Redirection vers le paiement...' : `Payer ${selectedPlan ? selectedPlan.price : ''} DZD et publier`}
          </button>
        </form>
      </div>

      {/* Active Ads */}
      {ads.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Annonces en cours</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {ads.map(ad => {
              const active = ad.start_date <= today && ad.end_date >= today;
              return (
                <div key={ad.id} className="card" style={{ padding: '1rem', opacity: active ? 1 : 0.5 }}>
                  <img src={ad.image_url} alt={ad.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem' }} />
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>{ad.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-500)' }}>{ad.placement}</span>
                  {!active && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--clr-red-light)' }}>Expirée</span>}
                  {isAdmin && (
                    <button onClick={() => handleDelete(ad.id)} className="btn btn-sm btn-secondary" style={{ marginTop: '0.5rem', width: '100%' }}>
                      Supprimer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
