import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Globe, Share2, ExternalLink, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">
              <span style={{ fontSize: '2.5rem' }}>🇩🇿</span>
              <div>
                <strong>{t('footer.brand_title')}</strong>
                <small>{t('footer.brand_subtitle')}</small>
              </div>
            </div>
            <p className="footer-desc">{t('footer.brand_desc')}</p>
            <div className="devize">
              <span className="devize-star">✦</span>
              <em>{t('footer.devize')}</em>
              <span className="devize-star">✦</span>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Globe size={18}/></a>
              <a href="#" aria-label="Twitter"><Share2 size={18}/></a>
              <a href="#" aria-label="YouTube"><ExternalLink size={18}/></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('footer.nav_title')}</h4>
            <ul>
              <li><Link to="/">{t('footer.nav_accueil')}</Link></li>
              <li><Link to="/signalements">{t('footer.nav_signalements')}</Link></li>
              <li><Link to="/propositions">{t('footer.nav_propositions')}</Link></li>
              <li><Link to="/projets">{t('footer.nav_projets')}</Link></li>
              <li><Link to="/entraide">{t('footer.nav_entraide')}</Link></li>
              <li><Link to="/actualites">{t('footer.nav_actualites')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.services_title')}</h4>
            <ul>
              <li><Link to="/signalements">{t('footer.svc_signalement')}</Link></li>
              <li><Link to="/propositions">{t('footer.svc_proposition')}</Link></li>
              <li><Link to="/entraide">{t('footer.svc_entraide')}</Link></li>
              <li><Link to="/projets">{t('footer.svc_projet')}</Link></li>
              <li><Link to="/dashboard">{t('footer.svc_dashboard')}</Link></li>
              <li><Link to="/apropos">{t('footer.svc_apropos')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.contact_title')}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>{t('footer.contact_address')}</span>
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
                <strong>{t('footer.admin_name')}</strong>
                <small>{t('footer.admin_role')}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright', { year })}</p>
          <p className="made-with">
            {t('footer.made_with')} <Heart size={14} className="heart" />
          </p>
        </div>
      </div>
    </footer>
  );
}
