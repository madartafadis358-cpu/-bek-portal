import { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: 'Signalement urgent',
    message: ''
  });
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({
      nom: '',
      email: '',
      sujet: 'Signalement urgent',
      message: ''
    });
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Une question ?</span>
        <h2>Contactez-nous</h2>
        <div className="divider" />
        <p>Une suggestion ? Un partenariat ? Ou un signalement spécifique à adresser à l'administrateur communal ? Remplissez le formulaire ci-dessous.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '3rem', marginTop: '2rem' }} className="grid-responsive-layout">
        
        {/* Contact details & admin info */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Informations de contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="flex-gap" style={{ alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(34,139,34,0.1)', border: '1px solid rgba(34,139,34,0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} style={{ color: 'var(--clr-green-glow)' }} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-100)' }}>Localisation</strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-300)' }}>Bordj El Kiffan, Alger, Algérie</span>
              </div>
            </div>

            <div className="flex-gap" style={{ alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} style={{ color: 'var(--clr-gold)' }} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-100)' }}>Téléphone</strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-300)' }}>0771 26 37 48</span>
              </div>
            </div>

            <div className="flex-gap" style={{ alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-100)' }}>E-mail</strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-300)' }}>b.mourad.computer@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <img src="/admin_profile_1780909824483.png" alt="Brik Chaouche Mourad" className="avatar" style={{ width: '56px', height: '56px' }} />
            <div>
              <strong style={{ display: 'block', color: 'var(--text-100)' }}>Brik Chaouche Mourad</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-green-glow)' }}>Créateur &amp; Super Administrateur de la plateforme</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card">
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet *</label>
              <input 
                type="text" 
                name="nom" 
                className="form-control"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Adresse e-mail *</label>
              <input 
                type="email" 
                name="email" 
                className="form-control"
                placeholder="Ex: citoyen@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Sujet *</label>
              <select 
                name="sujet" 
                className="form-control"
                value={formData.sujet}
                onChange={handleInputChange}
              >
                <option value="Signalement urgent">Signalement urgent</option>
                <option value="Suggestion d'amélioration">Suggestion d'amélioration</option>
                <option value="Bénévolat / Association">Bénévolat / Association</option>
                <option value="Autre demande">Autre demande</option>
              </select>
            </div>

            <div className="form-group">
              <label>Votre message *</label>
              <textarea 
                name="message" 
                className="form-control"
                placeholder="Écrivez votre message ici..."
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Send size={16} /> Envoyer le message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
