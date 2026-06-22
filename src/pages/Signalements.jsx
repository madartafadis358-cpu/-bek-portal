import { useState, useRef } from 'react';
import { MapPin, Upload, Search, Filter, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const categories = [
  'Voirie et routes',
  'Éclairage public',
  'Propreté et environnement',
  'Sécurité',
  'Transport',
  'Urbanisme',
  'Services publics',
  'Autres'
];

const categoryIcons = {
  'Voirie et routes': '🛣️',
  'Éclairage public': '💡',
  'Propreté et environnement': '🌿',
  'Sécurité': '🛡️',
  'Transport': '🚌',
  'Urbanisme': '🏗️',
  'Services publics': '🏛️',
  'Autres': '📋'
};

const statusColors = {
  'Nouveau': 'badge-gold',
  'En cours': 'badge-blue',
  'Résolu': 'badge-green',
  'En attente': 'badge-purple'
};

function getPhotos(signalementId) {
  try {
    return JSON.parse(localStorage.getItem('sig_photos_' + signalementId) || '[]');
  } catch { return []; }
}

function setPhotos(signalementId, photos) {
  localStorage.setItem('sig_photos_' + signalementId, JSON.stringify(photos));
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default function Signalements() {
  const { state, addSignalement, voteSignalement } = useApp();
  const [filter, setFilter] = useState('Tous');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'Voirie et routes',
    quartier: '',
    description: '',
    geoloc: ''
  });
  const [photos, setPhotosState] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [expandedPhotos, setExpandedPhotos] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFiles = async (files) => {
    const valid = [];
    for (const f of files) {
      if (f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024) {
        const dataUrl = await readFileAsDataURL(f);
        valid.push({ name: f.name, dataUrl, type: f.type });
      }
    }
    setPhotosState(prev => [...prev, ...valid].slice(0, 5));
  };

  const handleFileInput = (e) => {
    if (e.target.files) handleFiles([...e.target.files]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles([...e.dataTransfer.files]);
  };

  const removePhoto = (index) => {
    setPhotosState(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.quartier || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const tempId = Date.now();
    await addSignalement(formData);
    if (photos.length > 0) setPhotos(tempId, photos);
    setSuccess('Votre signalement a été soumis avec succès et sera validé par un modérateur.');
    setFormData({ titre: '', categorie: 'Voirie et routes', quartier: '', description: '', geoloc: '' });
    setPhotosState([]);
    setTimeout(() => {
      setSuccess('');
      setShowForm(false);
    }, 3000);
  };

  const filteredSignalements = state.signalements.filter(s => {
    const matchesFilter = filter === 'Tous' || s.categorie === filter;
    const matchesSearch = (s.titre || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.description || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.quartier || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Espace Participatif</span>
        <h2>Préoccupations &amp; Signalements</h2>
        <div className="divider" />
        <p>Signalez les anomalies ou dysfonctionnements dans la commune de Bordj El Kiffan pour une intervention rapide.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '2rem' }}>

        <div style={{ flex: '2 1 600px' }}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex-gap" style={{ flex: '1 1 300px' }}>
                <Search size={18} style={{ color: 'var(--text-400)' }} />
                <input type="text" className="form-control" placeholder="Rechercher un signalement ou un quartier..."
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex-gap" style={{ flex: '0 1 auto' }}>
                <Filter size={16} style={{ color: 'var(--text-400)' }} />
                <select className="form-control" style={{ width: '200px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="Tous">Toutes les catégories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredSignalements.length > 0 ? (
              filteredSignalements.map(s => {
                const itemPhotos = getPhotos(s.id);
                return (
                <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex-between">
                    <div className="flex-gap">
                      <span style={{ fontSize: '2rem' }}>{categoryIcons[s.categorie]}</span>
                      <div>
                        <h4 style={{ margin: 0 }}>{s.titre}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Catégorie : {s.categorie}</span>
                      </div>
                    </div>
                    <span className={`badge ${statusColors[s.statut] || 'badge-blue'}`}>{s.statut}</span>
                  </div>

                  <p style={{ fontSize: '0.92rem' }}>{s.description}</p>

                  {itemPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {itemPhotos.slice(0, expandedPhotos[s.id] ? itemPhotos.length : 2).map((p, i) => (
                        <img key={i} src={p.dataUrl} alt=""
                          style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                      ))}
                      {itemPhotos.length > 2 && !expandedPhotos[s.id] && (
                        <button className="btn btn-sm btn-secondary" onClick={() => setExpandedPhotos(prev => ({ ...prev, [s.id]: true }))}>
                          +{itemPhotos.length - 2} photos
                        </button>
                      )}
                    </div>
                  )}

                  <div className="card-meta" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span><MapPin size={14} style={{ color: 'var(--clr-red-light)' }} /> {s.quartier}</span>
                      <span>📅 {s.date}</span>
                    </div>
                    <button onClick={() => voteSignalement(s.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-200)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--clr-green-glow)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                      👍 Soutenir ({s.votes})
                    </button>
                  </div>
                </div>
                );
              })
            ) : (
              <div className="card text-center" style={{ padding: '3rem 1rem' }}>
                <AlertCircle size={40} style={{ color: 'var(--text-400)', marginBottom: '1rem' }} />
                <p>Aucun signalement ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: '1 1 350px', position: 'sticky', top: '90px' }}>
          {!showForm ? (
            <div className="card text-center" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📢</div>
              <h3>Nouveau Signalement</h3>
              <p style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                Vous avez constaté une anomalie sur la voie publique, une panne d'éclairage ou tout autre problème communal ?
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                Signaler un problème
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Nouveau Signalement</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowForm(false)}>Fermer</button>
              </div>

              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Titre de la préoccupation *</label>
                  <input type="text" name="titre" className="form-control" placeholder="Ex: Nid de poule sur la route"
                    value={formData.titre} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select name="categorie" className="form-control" value={formData.categorie} onChange={handleInputChange}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quartier / Adresse *</label>
                  <input type="text" name="quartier" className="form-control" placeholder="Ex: Cité 5 Juillet"
                    value={formData.quartier} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Description détaillée *</label>
                  <textarea name="description" className="form-control" placeholder="Décrivez précisément le problème et son impact..."
                    value={formData.description} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Ajouter des photos (max 5)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed ' + (dragging ? 'var(--clr-green-glow)' : 'var(--bg-600)'),
                      borderRadius: 'var(--radius-sm)', padding: '1.5rem', cursor: 'pointer',
                      background: dragging ? 'rgba(34,197,94,0.05)' : 'var(--bg-900)',
                      transition: 'all .2s', textAlign: 'center'
                    }}>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileInput} />
                    <Upload size={24} style={{ margin: '0 auto 0.5rem', color: 'var(--clr-green-glow)' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>
                      {dragging ? 'Déposez les fichiers ici' : 'Glisser-déposer ou cliquer pour importer'}
                    </div>
                  </div>
                  {photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {photos.map((p, i) => (
                        <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                          <img src={p.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                          <button type="button" onClick={() => removePhoto(i)}
                            style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'var(--clr-red-light)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Soumettre le signalement
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
