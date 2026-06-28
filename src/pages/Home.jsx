import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Lightbulb, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PartnerCard from '../components/directory/PartnerCard.jsx';
import AdBanner from '../components/ads/AdBanner.jsx';
import './Home.css';

const categoryIcons = { 'Voirie et routes': '🛣️', 'Éclairage public': '💡', 'Propreté et environnement': '🌿', 'Sécurité': '🛡️', 'Transport': '🚌', 'Urbanisme': '🏗️', 'Services publics': '🏛️', 'Autres': '📋' };
const statusColors = { 'Nouveau': 'badge-gold', 'En cours': 'badge-blue', 'Résolu': 'badge-green', 'En attente': 'badge-purple' };

export default function Home() {
  const { t } = useTranslation();
  const { state } = useApp();
  const { stats, signalements, propositions, projets } = state;
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch('/api/business/register')
      .then(r => r.json())
      .then(d => setPartners((d.businesses || []).filter(b => b.is_premium)))
      .catch(() => {});
  }, []);

  return (
    <div className="page-wrapper hero-gradient">

      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-up">
            <div className="hero-badge">
              <span>🇩🇿</span>
              <span>{t('home.hero_badge')}</span>
            </div>
            <h1>{t('home.hero_title')}<br /><span className="gradient-text">{t('home.hero_title_gradient')}</span></h1>
            <p className="hero-desc">{t('home.hero_desc')}</p>
            <div className="devize-hero">
              <span>✦</span>
              <em>{t('home.hero_devize')}</em>
              <span>✦</span>
            </div>
            <div className="hero-actions">
              <Link to="/signalements" className="btn btn-primary btn-lg">
                {t('home.hero_btn_signalement')} <ArrowRight size={18} />
              </Link>
              <Link to="/propositions" className="btn btn-secondary btn-lg">
                {t('home.hero_btn_proposition')} <Lightbulb size={18} />
              </Link>
            </div>
          </div>

          <div className="hero-admin-card animate-fade-up delay-3">
            <img src="/admin_mourad.jpg" alt="Brik Chaouche Mourad" className="hero-admin-photo" />
            <div>
              <strong>{t('home.admin_card_name')}</strong>
              <span>{t('home.admin_card_role')}</span>
              <div className="verified-badge"><CheckCircle size={12} /> {t('home.admin_card_verified')}</div>
            </div>
            <a href="/guide" target="_blank" rel="noopener noreferrer" className="guide-btn">
              {t('nav.guide_btn')}
            </a>
          </div>
        </div>

        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="stats-row">
            {[
              { icon: '📋', value: stats.signalements.toLocaleString(), label: t('home.stats_signalements'), color: 'var(--clr-red-light)' },
              { icon: '💡', value: stats.propositions.toLocaleString(), label: t('home.stats_propositions'), color: 'var(--clr-gold)' },
              { icon: '🚀', value: stats.projets, label: t('home.stats_projets_actifs'), color: 'var(--clr-green-glow)' },
              { icon: '🤝', value: stats.benevoles.toLocaleString(), label: t('home.stats_benevoles'), color: '#60a5fa' },
              { icon: '✅', value: stats.resolus.toLocaleString(), label: t('home.stats_resolus'), color: '#a78bfa' },
              { icon: '👥', value: stats.membres.toLocaleString(), label: t('home.stats_membres'), color: 'var(--clr-gold-light)' },
            ].map((s, i) => (
              <div key={i} className={`stat-card animate-fade-up delay-${i + 1}`}>
                <div className="stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  {s.icon}
                </div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdBanner placement="inline" />

      <section className="section cta-section">
        <div className="container">
          <div className="cta-box animate-fade-up">
            <div className="cta-flags">🇩🇿</div>
            <h2>{t('home.cta_title')}</h2>
            <p>{t('home.cta_desc', { count: stats.membres.toLocaleString() })}</p>
            <div className="cta-actions">
              <Link to="/signalements" className="btn btn-primary btn-lg">{t('home.cta_btn_signalement')}</Link>
              <Link to="/propositions" className="btn btn-gold btn-lg">{t('home.cta_btn_proposition')}</Link>
              <Link to="/entraide" className="btn btn-secondary btn-lg">{t('home.cta_btn_entraide')}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">{t('home.modules_overline')}</span>
            <h2>{t('home.modules_title')}</h2>
            <div className="divider" />
            <p>{t('home.modules_desc')}</p>
          </div>
          <div className="modules-grid">
            {[
              { icon: '📍', key: 'signalements', to: '/signalements', color: 'var(--clr-red-light)', badge: `${signalements.length} ${t('home.module_signalements').toLowerCase()}` },
              { icon: '💡', key: 'propositions', to: '/propositions', color: 'var(--clr-gold)', badge: `${propositions.length} ${t('home.module_propositions').toLowerCase()}` },
              { icon: '🚀', key: 'projets', to: '/projets', color: 'var(--clr-green-glow)', badge: `${projets.length} ${t('home.module_projets').toLowerCase()}` },
              { icon: '🤝', key: 'entraide', to: '/entraide', color: '#60a5fa', badge: t('home.module_entraide') },
            ].map((m, i) => (
              <Link to={m.to} key={i} className={`module-card animate-fade-up delay-${i + 1}`} style={{ '--accent': m.color }}>
                <div className="module-icon">{m.icon}</div>
                <span className="badge badge-green module-badge">{m.badge}</span>
                <h3>{t(`home.module_${m.key}`)}</h3>
                <p>{t(`home.module_${m.key}_desc`)}</p>
                <div className="module-arrow">
                  {t('home.module_btn')} <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="overline" style={{ color: 'var(--clr-red-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('home.recent_overline')}</span>
              <h2>{t('home.recent_title')}</h2>
            </div>
            <Link to="/signalements" className="btn btn-secondary hide-mobile">{t('home.recent_btn')} <ArrowRight size={16} /></Link>
          </div>
          <div className="grid-2" style={{ marginTop: '2rem' }}>
            {signalements.slice(0, 4).map((s, i) => (
              <div key={s.id} className={`card signalement-card animate-fade-up delay-${i + 1}`}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <span className="cat-icon">{categoryIcons[s.categorie] || '📋'}</span>
                  <span className={`badge ${statusColors[s.statut] || 'badge-blue'}`}>{s.statut}</span>
                </div>
                <h4>{s.titre}</h4>
                <p style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>{s.description}</p>
                <div className="card-meta">
                  <span><MapPin size={12} /> {s.quartier}</span>
                  <span>👍 {s.votes}</span>
                  <span>📅 {s.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/signalements" className="btn btn-primary">
              {t('home.recent_btn_all')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">{t('home.top_overline')}</span>
            <h2>{t('home.top_title')}</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {propositions.slice(0, 3).map((p, i) => (
              <div key={p.id} className={`card prop-card animate-fade-up delay-${i + 1}`}>
                <div className="prop-rank">#{i + 1}</div>
                <h4>{p.titre}</h4>
                <p style={{ fontSize: '0.85rem', margin: '0.75rem 0' }}>{p.description}</p>
                <div className="card-meta">
                  <span className="badge badge-blue">{p.categorie}</span>
                  <span>👍 {p.votes} {t('home.stats_propositions').toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/propositions" className="btn btn-gold">
              <Star size={16} /> {t('home.top_btn')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">{t('home.projets_overline')}</span>
            <h2>{t('home.projets_title')}</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {projets.map((p, i) => (
              <div key={p.id} className={`card animate-fade-up delay-${i + 1}`}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <span className="badge badge-green">{p.statut}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>👥 {p.benevoles} {t('home.stats_benevoles').toLowerCase()}</span>
                </div>
                <h4>{p.titre}</h4>
                <p style={{ fontSize: '0.85rem', margin: '0.75rem 0' }}>{p.description}</p>
                <div style={{ marginTop: '1rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>{t('home.projets_avancement')}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-green-glow)' }}>{p.avancement}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${p.avancement}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title animate-fade-up">
              <span className="overline">{t('home.partners_title')}</span>
              <h2>{t('home.partners_subtitle')}</h2>
              <div className="divider" />
            </div>
            <div className="partners-scroll">
              {partners.map(p => (
                <PartnerCard key={p.id} business={p} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
