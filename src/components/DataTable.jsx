import { useState } from 'react';
import { Search, Trash2, AlertTriangle } from 'lucide-react';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal card" style={{ maxWidth: 420, padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <AlertTriangle size={28} style={{ color: 'var(--clr-gold)', flexShrink: 0 }} />
          <h3 style={{ margin: 0 }}>Confirmer la suppression</h3>
        </div>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.92rem', color: 'var(--text-300)' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-sm btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Annuler</button>
          <button className="btn btn-sm" style={{ flex: 1, justifyContent: 'center', background: 'var(--clr-red)', color: '#fff', border: 'none' }} onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function DataTable({ items, searchKey = 'titre', placeholder = 'Rechercher...', renderRow, onDelete, label }) {
  const [q, setQ] = useState('');
  const [confirm, setConfirm] = useState(null);

  const filtered = items.filter(item =>
    (item[searchKey] || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex-gap" style={{ marginBottom: '1rem' }}>
        <Search size={16} style={{ color: 'var(--text-400)' }} />
        <input type="text" className="form-control" placeholder={placeholder} value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>Aucun résultat trouvé.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)' }}>
              {renderRow(item)}
              <button onClick={() => setConfirm({ item, label: label(item) })}
                style={{ background: 'none', border: 'none', color: 'var(--clr-red-light)', cursor: 'pointer', padding: '0.25rem' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {confirm && (
        <ConfirmModal
          message={`Supprimer ${confirm.label} ? Cette action est irréversible.`}
          onConfirm={() => { onDelete(confirm.item.id); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
