import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, Lightbulb, Rocket, Heart, Users, Megaphone, HelpCircle, ChevronDown } from 'lucide-react';
import './GuideCitoyen.css';

const sections = [
  {
    id: 'acceder',
    icon: <BookOpen size={28} />,
    emoji: '🌐',
    title: 'Accéder au portail',
    desc: 'Ouvrez votre navigateur sur n\'importe quel appareil (PC, tablette, smartphone) et rendez-vous sur le lien.',
    steps: [
      'Ouvrez Chrome, Firefox ou Safari',
      'Tapez : bek-portal.onrender.com',
      'La page d\'accueil s\'affiche avec la barre de navigation en haut',
    ],
    tip: 'Le site met ~30s à se réveiller si personne ne l\'a visité depuis 15 min (gratuit). Rafraîchissez une fois après 30s.',
    img: '/guide/hero.png',
    imgAlt: 'Page d\'accueil du portail BEK',
  },
  {
    id: 'signaler',
    icon: <MapPin size={28} />,
    emoji: '📍',
    title: 'Signaler un problème',
    desc: 'Déclarez un souci dans la commune : voirie, éclairage, propreté, sécurité, etc.',
    steps: [
      'Cliquez sur "Signalements" dans la barre de navigation',
      'Cliquez sur "Nouveau signalement"',
      'Titre : soyez précis (ex: "Nid de poule rue des Fleurs")',
      'Catégorie : choisissez parmi la liste',
      'Description : détaillez le problème',
      'Quartier : indiquez le lieu exact',
      'Photo : ajoutez une image (recommandé)',
      'Cliquez sur "Publier"',
    ],
    tip: 'Les signalements avec photo sont traités 3× plus vite par les administrateurs.',
    img: '/guide/signalement.png',
    imgAlt: 'Formulaire de signalement',
  },
  {
    id: 'proposer',
    icon: <Lightbulb size={28} />,
    emoji: '💡',
    title: 'Proposer une idée',
    desc: 'Suggérez une amélioration pour la commune et obtenez le soutien des autres citoyens.',
    steps: [
      'Cliquez sur "Propositions" dans la navigation',
      'Cliquez sur "Nouvelle proposition"',
      'Titre clair et accrocheur',
      'Catégorie : associez votre idée à un thème',
      'Description : expliquez votre idée en détail',
      'Cliquez sur "Publier"',
    ],
    tip: 'Les propositions les plus votées (👍) remontent en tête de liste et sont examinées en priorité.',
    img: '/guide/proposition.png',
    imgAlt: 'Page des propositions',
  },
  {
    id: 'projets',
    icon: <Rocket size={28} />,
    emoji: '🚀',
    title: 'Participer à un projet',
    desc: 'Rejoignez des projets citoyens en cours : parc municipal, bibliothèque, formation numérique...',
    steps: [
      'Cliquez sur "Projets" dans la navigation',
      'Parcourez les projets actifs',
      'Cliquez sur un projet pour voir les détails (avancement, bénévoles, description)',
      'Contactez l\'équipe via les informations fournies',
    ],
    tip: 'Chaque projet affiche son avancement en temps réel. Plus on est de bénévoles, plus ça avance vite !',
    img: '/guide/projets.png',
    imgAlt: 'Page des projets citoyens',
  },
  {
    id: 'entraide',
    icon: <Heart size={28} />,
    emoji: '🤝',
    title: 'Offrir ou recevoir de l\'aide',
    desc: 'Proposez votre bénévolat, votre expertise, ou demandez un coup de main à la communauté.',
    steps: [
      'Cliquez sur "Entraide"',
      'Pour offrir : cliquez sur "Publier une annonce"',
      'Choisissez le type : Bénévolat, Aide matérielle, Expertise',
      'Décrivez ce que vous proposez ou recherchez',
      'Indiquez un contact (email ou téléphone)',
    ],
    tip: 'Soyez précis dans votre description pour attirer les bonnes personnes.',
    img: '/guide/entraide.png',
    imgAlt: 'Page d\'entraide',
  },
  {
    id: 'soutenir',
    icon: <Heart size={28} />,
    emoji: '❤️',
    title: 'Soutenir financièrement',
    desc: 'Faites un don pour soutenir le portail et ses actions citoyennes.',
    steps: [
      'Cliquez sur "Soutenir" dans la navigation',
      'Entrez le montant en DZD (minimum 50 دج)',
      'Optionnel : votre nom et un message',
      'Cliquez sur "Soutenir"',
      'Paiement sécurisé via Chargily Pay (CIB / Edahabia)',
      'Un reçu s\'affiche après confirmation',
    ],
    tip: '100 % des dons sont reversés au développement du portail et des projets citoyens.',
    img: '/guide/don.png',
    imgAlt: 'Page de don',
  },
  {
    id: 'inscription',
    icon: <Users size={28} />,
    emoji: '👥',
    title: 'S\'inscrire comme membre',
    desc: 'Devenez membre officiel de la communauté BEK pour accéder à votre tableau de bord personnel.',
    steps: [
      'Cliquez sur "Rejoindre" en haut à droite',
      'Remplissez : Nom complet, Email (optionnel)',
      'Cliquez sur "S\'inscrire"',
      'Votre inscription est soumise à validation par un administrateur',
    ],
    tip: 'Une fois validé, vous apparaissez dans le compteur de membres et pouvez suivre vos contributions.',
    img: '/guide/inscription.png',
    imgAlt: "Formulaire d'inscription",
  },
  {
    id: 'publicite',
    icon: <Megaphone size={28} />,
    emoji: '📢',
    title: 'Publier une annonce publicitaire',
    desc: 'Faites connaître votre commerce ou activité auprès de toute la communauté BEK.',
    steps: [
      'Cliquez sur "Publicité" dans la navigation',
      'Choisissez votre formule : Sidebar (500 DZD/mois), Header (1000 DZD/mois), Inline (300 DZD/mois)',
      'Titre de l\'annonce',
      'Image au format paysage',
      'Lien vers votre site ou page',
      'Paiement via Chargily Pay',
      'Annonce activée après confirmation du paiement',
    ],
    tip: 'La formule Inline est la plus économique et la plus vue dans le fil d\'actualité.',
    img: '/guide/publicite.png',
    imgAlt: 'Page publicité',
  },
  {
    id: 'faq',
    icon: <HelpCircle size={28} />,
    emoji: '❓',
    title: 'Questions fréquentes',
    desc: 'Les réponses aux questions les plus courantes.',
    isFaq: true,
  },
];

const faqItems = [
  { q: 'Le site est gratuit ?', a: 'Oui, pour les citoyens (signaler, proposer, voter). Seules les annonces publicitaires sont payantes.' },
  { q: 'Qui gère le site ?', a: 'Le Super Administrateur Brik Chaouche Mourad et son équipe.' },
  { q: 'Comment contacter l\'équipe ?', a: 'Via la page "Contact" du site, par email (b.mourad.computer@gmail.com) ou par téléphone (0771 26 37 48).' },
  { q: 'Mes données sont-elles protégées ?', a: 'Oui. Mots de passe cryptés (bcrypt), connexions sécurisées (JWT), site en HTTPS.' },
  { q: 'Le site ne répond pas ?', a: 'Le site peut mettre 30 secondes à se réveiller après une période d\'inactivité (hébergement gratuit). Rafraîchissez la page et attendez.' },
  { q: 'Comment devenir administrateur ?', a: 'Seul le Super Administrateur peut nommer des administrateurs. Contactez-le directement.' },
];

export default function GuideCitoyen() {
  const [activeSection, setActiveSection] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('guide-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="guide-page">
      {/* Hero */}
      <section className="guide-hero">
        <div className="container">
          <Link to="/" className="guide-back">
            <ArrowLeft size={18} /> Retour à l'accueil
          </Link>
          <div className="guide-hero-content animate-fade-up">
            <span className="guide-hero-badge">📖 Guide officiel</span>
            <h1>Guide du citoyen</h1>
            <p className="guide-hero-desc">
              Tout ce que vous devez savoir pour utiliser le Portail Citoyen de Bordj El Kiffan
            </p>
          </div>
        </div>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </section>

      {/* Sommaire */}
      <section className="section">
        <div className="container">
          <div className="guide-toc">
            <span className="guide-toc-label">Sommaire</span>
            <div className="guide-toc-grid">
              {sections.map((s) => (
                <button
                  key={s.id}
                  className={`guide-toc-item ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="guide-toc-icon">{s.emoji}</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, idx) => {
        if (section.isFaq) {
          return (
            <section key={section.id} id={section.id} className="section guide-section"
              ref={(el) => (sectionRefs.current[section.id] = el)}>
              <div className="container">
                <div className="guide-section-header">
                  <div className="guide-section-icon">{section.icon}</div>
                  <div>
                    <span className="overline">FAQ</span>
                    <h2>{section.title}</h2>
                    <p className="guide-section-desc">{section.desc}</p>
                  </div>
                </div>
                <div className="guide-faq-list">
                  {faqItems.map((item, i) => (
                    <div key={i} className={`guide-faq-item ${openFaq === i ? 'open' : ''}`}>
                      <button className="guide-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span>{item.q}</span>
                        <ChevronDown size={18} className="guide-faq-chevron" />
                      </button>
                      <div className="guide-faq-answer">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return (
          <section key={section.id} id={section.id} className="section guide-section guide-fade"
            ref={(el) => (sectionRefs.current[section.id] = el)}>
            <div className="container">
              <div className={`guide-card ${idx % 2 === 1 ? 'guide-card-reverse' : ''}`}>
                <div className="guide-card-content">
                  <div className="guide-section-header">
                    <div className="guide-section-icon" style={{ '--icon-color': `var(${['--clr-green-glow','--clr-red-light','--clr-gold','--clr-green-glow','#60a5fa','--clr-red-light','--clr-gold','--clr-green-glow'][idx]})` }}>
                      {section.icon}
                    </div>
                    <div>
                      <span className="overline">{section.emoji} Étape {idx + 1}</span>
                      <h2>{section.title}</h2>
                      <p className="guide-section-desc">{section.desc}</p>
                    </div>
                  </div>

                  <div className="guide-steps">
                    {section.steps.map((step, i) => (
                      <div key={i} className="guide-step" style={{ transitionDelay: `${i * 0.05}s` }}>
                        <span className="guide-step-num">{i + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {section.tip && (
                    <div className="guide-tip">
                      <span className="guide-tip-icon">💡</span>
                      <div>
                        <strong>Astuce :</strong> {section.tip}
                      </div>
                    </div>
                  )}
                </div>

                <div className="guide-card-visual">
                  <div className="guide-img-placeholder">
                    <div className="guide-img-icon">{section.emoji}</div>
                    <div className="guide-img-label">{section.imgAlt}</div>
                    <div className="guide-img-shine" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA finale */}
      <section className="section guide-cta-section">
        <div className="container">
          <div className="guide-cta-box animate-fade-up">
            <h2>Prêt à participer ?</h2>
            <p>Rejoignez les {typeof window !== 'undefined' ? 'centaines de' : ''} citoyens qui font la différence à Bordj El Kiffan</p>
            <div className="guide-cta-actions">
              <Link to="/signalements" className="btn btn-primary btn-lg">
                Signaler un problème <MapPin size={18} />
              </Link>
              <Link to="/propositions" className="btn btn-gold btn-lg">
                Proposer une idée <Lightbulb size={18} />
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
