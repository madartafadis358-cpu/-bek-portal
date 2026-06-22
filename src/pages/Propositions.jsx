import { useState } from 'react';
import { ThumbsUp, MessageCircle, Send, Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const themes = [
  'Tous',
  'Environnement et Espaces verts',
  'Culture et Loisirs',
  'Sport et Jeunesse',
  'Transport et Mobilité',
  'Sécurité',
  'Solidarité et Social',
  'Éducation et Enfance',
  'Autres'
];

export default function Propositions() {
  const { state, addProposition, voteProposition } = useApp();
  const [activeTheme, setActiveTheme] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Comments simulation state
  const [comments, setComments] = useState({
    1: [
      { id: 1, author: 'Sofia', content: 'Très bonne idée, le parc central a besoin de plus de sécurité.', date: '2026-06-03' },
      { id: 2, author: 'Mourad', content: 'Tout à fait d\'accord. L\'éclairage devrait aussi être renforcé.', date: '2026-06-04' }
    ],
    2: [
      { id: 3, author: 'Amine', content: 'Excellente initiative ! Cela réduirait considérablement le temps de trajet vers Alger.', date: '2026-06-01' },
      { id: 4, author: 'Rachid', content: 'Il faudrait aussi prévoir des abribus confortables pour les usagers.', date: '2026-06-02' }
    ],
    3: [
      { id: 5, author: 'Karima', content: 'Planter des arbres est indispensable avec les vagues de chaleur en été.', date: '2026-05-26' },
      { id: 6, author: 'Yacine', content: 'Je suis partant pour participer aux journées de plantation le week-end !', date: '2026-05-27' }
    ]
  });
  const [activeCommentsPropId, setActiveCommentsPropId] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'Environnement et Espaces verts',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    addProposition({ 
      ...formData, 
      auteur: state.user ? state.user.name : 'Citoyen Anonyme' 
    });
    setSuccess('Votre proposition a été enregistrée. Elle est ouverte aux votes des citoyens !');
    setFormData({
      titre: '',
      categorie: 'Environnement et Espaces verts',
      description: '',
    });
    setTimeout(() => {
      setSuccess('');
      setShowForm(false);
    }, 3000);
  };

  const handleVote = (id) => {
    voteProposition(id);
  };

  const handleAddComment = (propId) => {
    if (!newComment.trim()) return;
    const commentToAdd = {
      id: Date.now(),
      author: state.user ? state.user.name : 'Citoyen Anonyme',
      content: newComment,
      date: new Date().toISOString().slice(0, 10)
    };
    setComments(prev => ({
      ...prev,
      [propId]: [...(prev[propId] || []), commentToAdd]
    }));
    setNewComment('');
  };

  const filteredPropositions = state.propositions.filter(p => {
    const matchesTheme = activeTheme === 'Tous' || p.categorie === activeTheme;
    const matchesSearch = p.titre.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  // Sort by votes (Descending)
  const sortedPropositions = [...filteredPropositions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Boîte à Idées</span>
        <h2>Propositions &amp; Améliorations</h2>
        <div className="divider" />
        <p>Soumettez vos idées de projets pour la commune de Bordj El Kiffan, discutez-en avec vos voisins et votez pour les meilleures initiatives.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '2rem' }} className="grid-responsive-layout">
        
        {/* Main proposals list */}
        <div>
          {/* Top Bar search and create */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex-gap" style={{ flex: '1 1 300px' }}>
              <Search size={18} style={{ color: 'var(--text-400)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Rechercher une idée, un projet..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-gold" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Soumettre une idée
            </button>
          </div>

          {/* Form Modal/Section */}
          {showForm && (
            <div className="card animate-fade-up" style={{ marginBottom: '2rem', border: '1px solid var(--clr-gold)' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-gold">📢 Partager une nouvelle idée</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>

              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Titre de l'idée *</label>
                  <input 
                    type="text" 
                    name="titre" 
                    className="form-control"
                    placeholder="Ex: Création d'une piste cyclable au bord de mer"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thème / Catégorie *</label>
                  <select 
                    name="categorie" 
                    className="form-control"
                    value={formData.categorie}
                    onChange={handleInputChange}
                  >
                    {themes.filter(t => t !== 'Tous').map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Description &amp; Objectifs *</label>
                  <textarea 
                    name="description" 
                    className="form-control"
                    placeholder="Détaillez votre idée, ses avantages pour les citoyens de la commune et comment la réaliser..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
                  Publier ma proposition
                </button>
              </form>
            </div>
          )}

          {/* Proposals List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedPropositions.length > 0 ? (
              sortedPropositions.map((p, idx) => (
                <div key={p.id} className="card" style={{ borderLeft: idx === 0 ? '4px solid var(--clr-gold)' : '1px solid var(--glass-border)' }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>{p.categorie}</span>
                      <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{p.titre}</h3>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleVote(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.5rem 1rem' }}>
                      <ThumbsUp size={16} />
                      <strong>{p.votes}</strong>
                    </button>
                  </div>

                  <p style={{ margin: '1rem 0', fontSize: '0.95rem' }}>{p.description}</p>

                  <div className="flex-between" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', fontSize: '0.82rem', color: 'var(--text-400)' }}>
                    <span>Par <strong>{p.auteur}</strong> le {p.date}</span>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveCommentsPropId(activeCommentsPropId === p.id ? null : p.id)}
                    >
                      <MessageCircle size={14} /> {(comments[p.id] || []).length || p.commentaires} Commentaires
                    </button>
                  </div>

                  {/* Comments section */}
                  {activeCommentsPropId === p.id && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                      <h4 style={{ marginBottom: '1rem' }}>Discussions</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                        {((comments[p.id] || [])).map(c => (
                          <div key={c.id} style={{ background: 'var(--bg-800)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                            <div className="flex-between" style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginBottom: '0.25rem' }}>
                              <strong>{c.author}</strong>
                              <span>{c.date}</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-200)' }}>{c.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex-gap">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Écrire un commentaire constructif..." 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleAddComment(p.id)}>
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card text-center" style={{ padding: '3rem 1rem' }}>
                <p>Aucune proposition dans ce thème pour l'instant.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar filters */}
        <div className="hide-mobile">
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Thématiques</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {themes.map(t => (
                <li key={t}>
                  <button 
                    onClick={() => setActiveTheme(t)}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '0.6rem 0.85rem', 
                      borderRadius: 'var(--radius-sm)',
                      background: activeTheme === t ? 'rgba(255,193,7,0.1)' : 'transparent',
                      color: activeTheme === t ? 'var(--clr-gold)' : 'var(--text-300)',
                      fontWeight: activeTheme === t ? 600 : 400,
                      border: activeTheme === t ? '1px solid rgba(255,193,7,0.2)' : '1px solid transparent',
                      fontSize: '0.88rem'
                    }}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
