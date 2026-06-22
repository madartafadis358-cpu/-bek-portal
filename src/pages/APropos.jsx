import { Shield, Users, Heart, CheckCircle } from 'lucide-react';

export default function APropos() {
  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Qui sommes-nous</span>
        <h2>À Propos de la Plateforme</h2>
        <div className="divider" />
        <p>Découvrez la mission, la vision et les valeurs fondamentales du Portail Citoyen de Bordj El Kiffan.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginTop: '2rem' }} className="grid-responsive-layout">
        
        {/* Story & Motto */}
        <div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Notre Vision</h3>
          <p style={{ marginBottom: '1.25rem', lineHeight: '1.8' }}>
            Cette plateforme est née d'une initiative citoyenne avec une ambition simple : rapprocher les habitants de la commune de Bordj El Kiffan (Fort-de-l'Eau) et encourager la démocratie participative locale.
          </p>
          <p style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
            Nous croyons fermement que chaque citoyen possède un rôle clé à jouer dans l'amélioration de son quartier, que ce soit à travers le signalement d'un problème quotidien ou la proposition de solutions constructives.
          </p>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,139,34,0.1), rgba(255,193,7,0.05))', border: '1px solid rgba(34,139,34,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>🇩🇿</div>
            <h4 style={{ textAlign: 'center', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--clr-gold-light)' }}>
              « Ensemble pour le bien des citoyens et du pays »
            </h4>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { icon: <Shield size={24} style={{ color: 'var(--clr-green-glow)' }} />, title: 'Citoyenneté active', desc: 'Prendre soin de notre espace de vie communal par des actions concrètes et le signalement constructif.' },
            { icon: <Users size={24} style={{ color: '#60a5fa' }} />, title: 'Solidarité locale', desc: 'Soutenir les résidents dans le besoin et offrir ses compétences ou du matériel pour le bien de tous.' },
            { icon: <Heart size={24} style={{ color: 'var(--clr-red-light)' }} />, title: 'Entraide & Bénévolat', desc: 'Encourager la collaboration intergénérationnelle et le développement communautaire.' }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ background: 'var(--bg-900)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.88rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Créateur ── */}
      <div className="section-title" style={{ marginTop: '4rem' }}>
        <span className="overline">L'initiateur</span>
        <h2>Créateur de la plateforme</h2>
        <div className="divider" />
      </div>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
        <img src="/admin_mourad.jpg" alt="Brik Chaouche Mourad" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--clr-gold)' }} />
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Brik Chaouche Mourad</h3>
          <p style={{ color: 'var(--clr-gold-light)', fontSize: '0.9rem', margin: '0.25rem 0' }}>Créateur &amp; Super Administrateur</p>
          <div className="verified-badge"><CheckCircle size={12} /> Vérifié</div>
        </div>
      </div>
    </div>
  );
}
