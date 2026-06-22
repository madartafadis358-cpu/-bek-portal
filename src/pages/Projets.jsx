import { useState } from 'react';
import { CheckCircle2, Users, Calendar, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Projets() {
  const { state } = useApp();
  const [signedUpProjs, setSignedUpProjs] = useState({});

  const handleSignUp = (projId) => {
    setSignedUpProjs(prev => ({ ...prev, [projId]: true }));
  };

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Action Collective</span>
        <h2>Projets Citoyens</h2>
        <div className="divider" />
        <p>Découvrez les initiatives citoyennes en cours de réalisation à Bordj El Kiffan. Participez en tant que bénévole ou contribuez avec du matériel.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {state.projets.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Badge & Meta */}
            <div className="flex-between">
              <span className="badge badge-green">{p.statut}</span>
              <span className="flex-gap" style={{ fontSize: '0.82rem', color: 'var(--text-400)' }}>
                <Calendar size={14} /> Débuté le {p.date}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{p.titre}</h3>
              <p style={{ fontSize: '0.92rem' }}>{p.description}</p>
            </div>

            {/* Objectives List */}
            <div style={{ background: 'var(--bg-900)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-100)', display: 'block', marginBottom: '0.5rem' }}>
                Objectif Principal :
              </strong>
              <div className="flex-gap" style={{ alignItems: 'flex-start', fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--clr-green-glow)', marginTop: '2px', flexShrink: 0 }} />
                <span>{p.objectif}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-400)' }}>Avancement du projet</span>
                <strong style={{ color: 'var(--clr-green-glow)' }}>{p.avancement}%</strong>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${p.avancement}%` }} />
              </div>
            </div>

            {/* Support / Needs */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div className="flex-gap" style={{ fontSize: '0.88rem', color: 'var(--text-300)' }}>
                  <Users size={16} style={{ color: '#60a5fa' }} />
                  <span><strong>{p.benevoles + (signedUpProjs[p.id] ? 1 : 0)}</strong> Bénévoles inscrits</span>
                </div>
              </div>

              {/* Action Button */}
              {signedUpProjs[p.id] ? (
                <div className="alert alert-success" style={{ margin: 0, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} />
                  <span>Merci pour votre inscription !</span>
                </div>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleSignUp(p.id)}>
                  Rejoindre en tant que bénévole
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
