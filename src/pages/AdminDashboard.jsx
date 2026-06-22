import { useState } from 'react';
import { Shield, AlertTriangle, Lightbulb, HeartHandshake, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import DataTable from '../components/DataTable.jsx';

export default function AdminDashboard() {
  const { state, deleteSignalement, deleteProposition, deleteEntraide, deleteMembre, deleteProjet, deleteActualite } = useApp();
  const [activeTab, setActiveTab] = useState('membres');

  const tabs = [
    { id: 'membres', label: 'Membres', icon: Shield, count: state.membres.length },
    { id: 'signalements', label: 'Signalements', icon: AlertTriangle, count: state.signalements.length },
    { id: 'propositions', label: 'Propositions', icon: Lightbulb, count: state.propositions.length },
    { id: 'projets', label: 'Projets', icon: ClipboardList, count: state.projets.length },
    { id: 'entraide', label: 'Entraide', icon: HeartHandshake, count: state.entraide.length },
    { id: 'actualites', label: 'Actualités', icon: ClipboardList, count: state.actualites.length },
  ];

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Administration</span>
        <h2>Tableau de bord administrateur</h2>
        <div className="divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { value: state.stats.membres, label: 'Membres validés', color: 'var(--clr-green-glow)' },
          { value: state.stats.signalements, label: 'Signalements', color: 'var(--clr-red-light)' },
          { value: state.stats.propositions, label: 'Propositions', color: 'var(--clr-gold)' },
          { value: state.stats.resolus, label: 'Résolus', color: '#60a5fa' },
          { value: state.stats.benevoles, label: 'Bénévoles', color: 'var(--clr-green-light)' },
          { value: state.projets.length, label: 'Projets actifs', color: 'var(--text-200)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: activeTab === tab.id ? '1px solid var(--clr-green-glow)' : '1px solid var(--glass-border)', background: activeTab === tab.id ? 'rgba(34,139,34,0.1)' : 'transparent', color: activeTab === tab.id ? 'var(--clr-green-glow)' : 'var(--text-300)', cursor: 'pointer', fontSize: '0.88rem', transition: 'all var(--transition-fast)' }}>
                <Icon size={16} />
                {tab.label}
                <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>({tab.count})</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'membres' && (
          <DataTable items={state.membres} searchKey="nom" placeholder="Rechercher un membre..." label={m => `le membre "${m.nom}"`} onDelete={deleteMembre}
            renderRow={m => (
              <>
                <Shield size={16} style={{ color: m.statut === 'valide' ? 'var(--clr-green-glow)' : m.statut === 'rejete' ? 'var(--clr-red-light)' : 'var(--clr-gold)', flexShrink: 0 }} />
                <strong style={{ flex: 1, fontSize: '0.92rem' }}>{m.nom}</strong>
                {m.email && <span style={{ fontSize: '0.82rem', color: 'var(--text-400)' }}>{m.email}</span>}
                <span className={`badge ${m.statut === 'valide' ? 'badge-green' : m.statut === 'rejete' ? 'badge-red' : 'badge-gold'}`} style={{ fontSize: '0.72rem' }}>{m.statut}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-500)' }}>{m.date_inscription}</span>
              </>
            )}
          />
        )}

        {activeTab === 'signalements' && (
          <DataTable items={state.signalements} placeholder="Rechercher un signalement..." label={s => `le signalement "${s.titre}"`} onDelete={deleteSignalement}
            renderRow={s => (
              <>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.92rem' }}>{s.titre}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginTop: '0.2rem' }}>{s.categorie} — {s.quartier} — {s.date}</div>
                </div>
                <span className={`badge ${s.statut === 'Résolu' ? 'badge-green' : s.statut === 'En cours' ? 'badge-blue' : s.statut === 'Nouveau' ? 'badge-gold' : 'badge-purple'}`} style={{ fontSize: '0.72rem' }}>{s.statut}</span>
              </>
            )}
          />
        )}

        {activeTab === 'propositions' && (
          <DataTable items={state.propositions} placeholder="Rechercher une proposition..." label={p => `la proposition "${p.titre}"`} onDelete={deleteProposition}
            renderRow={p => (
              <>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.92rem' }}>{p.titre}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginTop: '0.2rem' }}>{p.categorie} — {p.auteur} — {p.date} — 👍 {p.votes}</div>
                </div>
              </>
            )}
          />
        )}

        {activeTab === 'projets' && (
          <DataTable items={state.projets} placeholder="Rechercher un projet..." label={p => `le projet "${p.titre}"`} onDelete={deleteProjet}
            renderRow={p => (
              <>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.92rem' }}>{p.titre}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginTop: '0.2rem' }}>{p.objectif} — {p.avancement}% — 👥 {p.benevoles} bénévoles</div>
                </div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>{p.statut}</span>
              </>
            )}
          />
        )}

        {activeTab === 'entraide' && (
          <DataTable items={state.entraide} placeholder="Rechercher une annonce..." label={e => `l'annonce "${e.titre}"`} onDelete={deleteEntraide}
            renderRow={e => (
              <>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.92rem' }}>{e.titre}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginTop: '0.2rem' }}>{e.type} — {e.auteur} — {e.date}</div>
                </div>
                <span className={`badge ${e.type === 'Bénévolat' ? 'badge-blue' : e.type === 'Aide matérielle' ? 'badge-gold' : 'badge-purple'}`} style={{ fontSize: '0.72rem' }}>{e.type}</span>
              </>
            )}
          />
        )}

        {activeTab === 'actualites' && (
          <DataTable items={state.actualites} placeholder="Rechercher une actualité..." label={a => `l'actualité "${a.titre}"`} onDelete={deleteActualite}
            renderRow={a => (
              <>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.92rem' }}>{a.titre}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginTop: '0.2rem' }}>{a.categorie} — {a.date}</div>
                </div>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
