import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Share2, ExternalLink, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="brand-logo">
              <span style={{ fontSize: '2.5rem' }}>🇩🇿</span>
              <div>
                <strong>Portail Citoyen</strong>
                <small>Bordj El Kiffan</small>
              </div>
            </div>
            <p className="footer-desc">
              Plateforme participative au service des citoyens de Bordj El Kiffan pour signaler, proposer et contribuer au développement de leur commune.
            </p>
            <div className="devize">
              <span className="devize-star">✦</span>
              <em>« Ensemble pour le bien des citoyens et du pays »</em>
              <span className="devize-star">✦</span>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Globe size={18}/></a>
              <a href="#" aria-label="Twitter"><Share2 size={18}/></a>
              <a href="#" aria-label="YouTube"><ExternalLink size={18}/></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/signalements">Signalements</Link></li>
              <li><Link to="/propositions">Propositions</Link></li>
              <li><Link to="/projets">Projets Citoyens</Link></li>
              <li><Link to="/entraide">Entraide</Link></li>
              <li><Link to="/actualites">Actualités</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/signalements">Déposer un signalement</Link></li>
              <li><Link to="/propositions">Soumettre une idée</Link></li>
              <li><Link to="/entraide">Offrir de l'aide</Link></li>
              <li><Link to="/projets">Rejoindre un projet</Link></li>
              <li><Link to="/dashboard">Tableau de bord</Link></li>
              <li><Link to="/apropos">À propos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>Bordj El Kiffan, Alger, Algérie</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>0771 26 37 48</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>b.mourad.computer@gmail.com</span>
              </div>
            </div>
            <div className="admin-card">
              <img src="/admin_profile_1780909824483.png" alt="Brik Chaouche Mourad" className="admin-avatar" />
              <div>
                <strong>Brik Chaouche Mourad</strong>
                <small>Créateur &amp; Super Administrateur</small>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Portail Citoyen de Bordj El Kiffan. Tous droits réservés.</p>
          <p className="made-with">
            Fait avec <Heart size={14} className="heart" /> pour les citoyens de BEK
          </p>
        </div>
      </div>
    </footer>
  );
}
