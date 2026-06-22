import { Check, X, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AdminMembres() {
  const { state, validateMember, rejectMember } = useApp();

  const pending = state.membres.filter(m => m.statut === 'en_attente');
  const valides = state.membres.filter(m => m.statut === 'valide');
  const rejetes = state.membres.filter(m => m.statut === 'rejete');

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Administration</span>
        <h2>Gestion des Membres</h2>
        <div className="divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-gold)' }}>{pending.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>En attente</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-green-glow)' }}>{valides.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Validés</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-red-light)' }}>{rejetes.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Rejetés</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>En attente de validation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(m => (
              <div key={m.id} className="flex-between" style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong>{m.nom}</strong>
                  {m.email && <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--text-400)' }}>{m.email}</span>}
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-500)' }}>— {m.date_inscription}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => validateMember(m.id)}>
                    <Check size={16} /> Valider
                  </button>
                  <button className="btn btn-sm btn-secondary" style={{ color: 'var(--clr-red-light)' }} onClick={() => rejectMember(m.id)}>
                    <X size={16} /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {valides.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Membres validés ({valides.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {valides.map(m => (
              <div key={m.id} style={{ padding: '0.75rem 1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={16} style={{ color: 'var(--clr-green-glow)' }} />
                <strong>{m.nom}</strong>
                {m.email && <span style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>{m.email}</span>}
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-500)' }}>{m.date_inscription}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && valides.length === 0 && rejetes.length === 0 && (
        <div className="card text-center" style={{ padding: '3rem 1rem' }}>
          <Shield size={40} style={{ color: 'var(--text-400)', marginBottom: '1rem' }} />
          <p>Aucun membre pour le moment.</p>
        </div>
      )}
    </div>
  );
}
