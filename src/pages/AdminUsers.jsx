import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

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

export default function AdminUsers() {
  const { state } = useApp();
  const isSuperAdmin = state.user?.role === 'superadmin';
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const headers = state.token ? { 'Authorization': `Bearer ${state.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetch('/api/admin/users', { headers })
      .then(r => r.json())
      .then(d => setAdmins(d.admins || []))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.username || !form.password) return setError('Nom et mot de passe requis');
    setError('');
    setMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`Admin "${data.admin.username}" créé avec succès`);
      setForm({ username: '', password: '', role: 'admin' });
      setAdmins(prev => [...prev, data.admin]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins(prev => prev.filter(a => a.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
      setConfirmDelete(null);
    }
  }

  if (!state.user) {
    return (
      <div className="page-wrapper container section text-center" style={{ padding: '4rem 1rem' }}>
        <Shield size={48} style={{ color: 'var(--text-400)', marginBottom: '1rem' }} />
        <h2>Accès refusé</h2>
        <p>Connectez-vous d'abord en tant qu'administrateur.</p>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="page-wrapper container section text-center" style={{ padding: '4rem 1rem' }}>
        <Shield size={48} style={{ color: 'var(--clr-red-light)', marginBottom: '1rem' }} />
        <h2>Accès réservé</h2>
        <p>Seul le Super Admin peut gérer les administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Super Admin</span>
        <h2>Gestion des Administrateurs</h2>
        <div className="divider" />
      </div>

      {msg && <div className="alert alert-success" style={{ textAlign: 'center', marginBottom: '1rem' }}>{msg}</div>}
      {error && <div className="alert alert-danger" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-green-glow)' }}>{admins.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Total administrateurs</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-gold)' }}>{admins.filter(a => a.role === 'superadmin').length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Super Admin(s)</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 300, padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} /> Créer un admin
          </h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Nom d'utilisateur *</label>
              <input className="form-control" placeholder="Ex: admin1" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Mot de passe *</label>
              <input type="password" className="form-control" placeholder="Mot de passe sécurisé" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Rôle</label>
              <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Plus size={18} /> Créer
            </button>
          </form>
        </div>

        <div className="card" style={{ flex: 2, minWidth: 300, padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} /> Liste des administrateurs
          </h3>
          {admins.length === 0 ? (
            <p style={{ color: 'var(--text-400)', textAlign: 'center', padding: '2rem 0' }}>Aucun administrateur.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {admins.map(a => (
                <div key={a.id} className="flex-between" style={{ padding: '0.75rem 1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield size={18} style={{ color: a.role === 'superadmin' ? 'var(--clr-gold)' : 'var(--clr-green-glow)' }} />
                    <div>
                      <strong>{a.username}</strong>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-400)', background: a.role === 'superadmin' ? 'rgba(212,175,55,0.15)' : 'rgba(16,185,129,0.15)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{a.role}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {a.created_at && <span style={{ fontSize: '0.75rem', color: 'var(--text-500)' }}>{a.created_at}</span>}
                    {a.role !== 'superadmin' && (
                      <button onClick={() => setConfirmDelete(a)} className="btn btn-sm btn-secondary" style={{ color: 'var(--clr-red-light)', padding: '0.3rem 0.6rem' }} title="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`Supprimer l'administrateur "${confirmDelete.username}" ? Cette action est irréversible.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
