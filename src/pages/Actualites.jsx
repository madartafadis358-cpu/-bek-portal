import { useState } from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Actualites() {
  const { state } = useApp();
  const [selectedNews, setSelectedNews] = useState(null);

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Actualités locales</span>
        <h2>Événements &amp; Réalisations</h2>
        <div className="divider" />
        <p>Restez informé des activités citoyennes, des chantiers de la commune et des projets concrétisés grâce à la participation des résidents de Bordj El Kiffan.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {state.actualites.map(news => (
          <div key={news.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              {/* Category Badge & Date */}
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={12} /> {news.categorie}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>
                  📅 {news.date}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: '1.3' }}>{news.titre}</h3>
              
              {/* Snippet */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-300)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {news.description}
              </p>
            </div>

            {/* Read more action */}
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setSelectedNews(news)}
            >
              Lire la suite <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal for detailed reading */}
      {selectedNews && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '1.5rem', backdropFilter: 'blur(5px)' }} className="flex-center">
          <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-900)' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-green">{selectedNews.categorie}</span>
              <button className="btn btn-sm btn-secondary" onClick={() => setSelectedNews(null)}>Fermer</button>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedNews.titre}</h2>
            
            <div style={{ fontSize: '0.82rem', color: 'var(--text-400)', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span>📅 Date de publication : {selectedNews.date}</span>
              <span>👤 Par : Administration BEK</span>
            </div>

            <p style={{ lineHeight: '1.8', color: 'var(--text-200)', fontSize: '0.98rem', whiteSpace: 'pre-line' }}>
              {selectedNews.description}
            </p>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setSelectedNews(null)}>Fermer la lecture</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
