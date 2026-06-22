import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Lightbulb, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PartnerCard from '../components/directory/PartnerCard.jsx';
import AdBanner from '../components/ads/AdBanner.jsx';
import './Home.css';

const categoryIcons = { 'Voirie et routes': '🛣️', 'Éclairage public': '💡', 'Propreté et environnement': '🌿', 'Sécurité': '🛡️', 'Transport': '🚌', 'Urbanisme': '🏗️', 'Services publics': '🏛️', 'Autres': '📋' };
const statusColors = { 'Nouveau': 'badge-gold', 'En cours': 'badge-blue', 'Résolu': 'badge-green', 'En attente': 'badge-purple' };

export default function Home() {
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

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-up">
            <a href="/guide" target="_blank" rel="noopener noreferrer" className="guide-btn">
              📖 Guide Utilisateur
            </a>
            <div className="hero-badge">
              <span>🇩🇿</span>
              <span>Commune de Bordj El Kiffan — Alger</span>
            </div>
            <h1>La voix des citoyens<br /><span className="gradient-text">de Bordj El Kiffan</span></h1>
            <p className="hero-desc">
              Signalez vos préoccupations, proposez des solutions, participez aux projets
              et contribuez activement au développement de votre commune.
            </p>
            <div className="devize-hero">
              <span>✦</span>
              <em>« Ensemble pour le bien des citoyens et du pays »</em>
              <span>✦</span>
            </div>
            <div className="hero-actions">
              <Link to="/signalements" className="btn btn-primary btn-lg">
                Signaler un problème <ArrowRight size={18} />
              </Link>
              <Link to="/propositions" className="btn btn-secondary btn-lg">
                Proposer une idée <Lightbulb size={18} />
              </Link>
            </div>
          </div>

          {/* Admin card floating */}
          <div className="hero-admin-card animate-fade-up delay-3">
            <img src="/admin_mourad.jpg" alt="Brik Chaouche Mourad" className="hero-admin-photo" />
            <div>
              <strong>Brik Chaouche Mourad</strong>
              <span>Créateur &amp; Super Administrateur</span>
              <div className="verified-badge"><CheckCircle size={12} /> Vérifié</div>
            </div>
          </div>
        </div>

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </section>

      {/* ── STATS ── */}
      <section className="section-sm">
        <div className="container">
          <div className="stats-row">
            {[
              { icon: '📋', value: stats.signalements.toLocaleString(), label: 'Signalements', color: 'var(--clr-red-light)' },
              { icon: '💡', value: stats.propositions.toLocaleString(), label: 'Propositions', color: 'var(--clr-gold)' },
              { icon: '🚀', value: stats.projets, label: 'Projets actifs', color: 'var(--clr-green-glow)' },
              { icon: '🤝', value: stats.benevoles.toLocaleString(), label: 'Bénévoles', color: '#60a5fa' },
              { icon: '✅', value: stats.resolus.toLocaleString(), label: 'Résolus', color: '#a78bfa' },
              { icon: '👥', value: stats.membres.toLocaleString(), label: 'Membres', color: 'var(--clr-gold-light)' },
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

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box animate-fade-up">
            <div className="cta-flags">🇩🇿</div>
            <h2>Rejoignez la communauté citoyenne</h2>
            <p>Plus de {stats.membres.toLocaleString()} citoyens participent déjà. Votre voix compte !</p>
            <div className="cta-actions">
              <Link to="/signalements" className="btn btn-primary btn-lg">Signaler un problème</Link>
              <Link to="/propositions" className="btn btn-gold btn-lg">Proposer une idée</Link>
              <Link to="/entraide" className="btn btn-secondary btn-lg">Offrir de l'aide</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section className="section">
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">Nos espaces</span>
            <h2>Comment participer ?</h2>
            <div className="divider" />
            <p>Choisissez l'espace qui correspond à votre engagement</p>
          </div>
          <div className="modules-grid">
            {[
              { icon: '📍', title: 'Signalements', desc: 'Signalez les problèmes de voirie, éclairage, propreté et plus encore.', to: '/signalements', color: 'var(--clr-red-light)', badge: `${signalements.length} actifs` },
              { icon: '💡', title: 'Propositions', desc: 'Soumettez vos idées d\'amélioration et votez pour les meilleures.', to: '/propositions', color: 'var(--clr-gold)', badge: `${propositions.length} idées` },
              { icon: '🚀', title: 'Projets Citoyens', desc: 'Rejoignez des projets concrets et contribuez à leur réalisation.', to: '/projets', color: 'var(--clr-green-glow)', badge: `${projets.length} projets` },
              { icon: '🤝', title: 'Entraide', desc: 'Offrez ou recevez de l\'aide matérielle, morale ou professionnelle.', to: '/entraide', color: '#60a5fa', badge: 'Solidarité' },
            ].map((m, i) => (
              <Link to={m.to} key={i} className={`module-card animate-fade-up delay-${i + 1}`} style={{ '--accent': m.color }}>
                <div className="module-icon">{m.icon}</div>
                <span className="badge badge-green module-badge">{m.badge}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <div className="module-arrow">
                  Participer <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT SIGNALEMENTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="overline" style={{ color: 'var(--clr-red-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Derniers signalements</span>
              <h2>Préoccupations citoyennes</h2>
            </div>
            <Link to="/signalements" className="btn btn-secondary hide-mobile">Voir tout <ArrowRight size={16} /></Link>
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
              Tous les signalements <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOP PROPOSITIONS ── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">💡 Idées citoyennes</span>
            <h2>Meilleures propositions</h2>
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
                  <span>👍 {p.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/propositions" className="btn btn-gold">
              <Star size={16} /> Voir toutes les propositions
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROJETS ── */}
      <section className="section">
        <div className="container">
          <div className="section-title animate-fade-up">
            <span className="overline">🚀 En cours</span>
            <h2>Projets citoyens actifs</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {projets.map((p, i) => (
              <div key={p.id} className={`card animate-fade-up delay-${i + 1}`}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <span className="badge badge-green">{p.statut}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>👥 {p.benevoles} bénévoles</span>
                </div>
                <h4>{p.titre}</h4>
                <p style={{ fontSize: '0.85rem', margin: '0.75rem 0' }}>{p.description}</p>
                <div style={{ marginTop: '1rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Avancement</span>
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
              <span className="overline">🤝 Nos partenaires</span>
              <h2>Commerces partenaires officiels</h2>
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
