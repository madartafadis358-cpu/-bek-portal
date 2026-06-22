import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const aidTypes = [
  'Aide morale',
  'Aide matérielle',
  'Bénévolat',
  'Expertise professionnelle',
  'Soutien à des projets'
];

const badgeColors = {
  'Aide morale': 'badge-purple',
  'Aide matérielle': 'badge-gold',
  'Bénévolat': 'badge-blue',
  'Expertise professionnelle': 'badge-green',
  'Soutien à des projets': 'badge-red'
};

export default function Entraide() {
  const { state, addEntraide } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [contacted, setContacted] = useState({});

  const [formData, setFormData] = useState({
    type: 'Bénévolat',
    titre: '',
    description: '',
    contact: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.description || !formData.contact) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    addEntraide({ 
      ...formData, 
      auteur: state.user ? state.user.name : 'Citoyen Solidaire' 
    });
    setSuccess('Votre annonce d\'entraide a été publiée avec succès !');
    setFormData({
      type: 'Bénévolat',
      titre: '',
      description: '',
      contact: ''
    });
    setTimeout(() => {
      setSuccess('');
      setShowForm(false);
    }, 3000);
  };

  const handleContact = (id) => {
    setContacted(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Solidarité</span>
        <h2>Entraide Citoyenne</h2>
        <div className="divider" />
        <p>Favorisez la solidarité locale à Bordj El Kiffan. Publiez vos offres d'aide, proposez vos compétences professionnelles ou soutenez les citoyens dans le besoin.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '2rem' }} className="grid-responsive-layout">
        
        {/* Ad Listings */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {state.entraide.length > 0 ? (
              state.entraide.map(item => (
                <div key={item.id} className="card" style={{ borderLeft: '4px solid var(--clr-green-glow)' }}>
                  <div className="flex-between">
                    <span className={`badge ${badgeColors[item.type] || 'badge-blue'}`}>{item.type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Publié le {item.date}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{item.titre}</h3>
                  <p style={{ fontSize: '0.92rem', marginBottom: '1.25rem' }}>{item.description}</p>
                  
                  <div className="flex-between" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-300)' }}>
                      Par <strong>{item.auteur}</strong>
                    </span>
                    {contacted[item.id] ? (
                      <span className="badge badge-green">Contact : {item.contact}</span>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleContact(item.id)}>
                        <Mail size={14} /> Contacter le bienfaiteur
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center" style={{ padding: '3rem 1rem' }}>
                <p>Aucune annonce d'entraide active pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Ad Section */}
        <div>
          {!showForm ? (
            <div className="card text-center" style={{ padding: '2.5rem 2rem', position: 'sticky', top: '90px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3>Offrir de l'aide</h3>
              <p style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                Vous souhaitez proposer un soutien matériel, du bénévolat, vos compétences professionnelles ou un conseil moral ?
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                Publier une annonce
              </button>
            </div>
          ) : (
            <div className="card animate-fade-up" style={{ position: 'sticky', top: '90px' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Publier une annonce</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowForm(false)}>Fermer</button>
              </div>

              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type de soutien *</label>
                  <select 
                    name="type" 
                    className="form-control"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {aidTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Titre de l'annonce *</label>
                  <input 
                    type="text" 
                    name="titre" 
                    className="form-control"
                    placeholder="Ex: Cours d'anglais gratuits"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description des offres / compétences *</label>
                  <textarea 
                    name="description" 
                    className="form-control"
                    placeholder="Décrivez en détail ce que vous pouvez offrir, vos disponibilités ou les modalités..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact (E-mail ou Téléphone) *</label>
                  <input 
                    type="text" 
                    name="contact" 
                    className="form-control"
                    placeholder="Ex: nom@email.com"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Publier l'annonce
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
