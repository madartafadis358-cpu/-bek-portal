import { Share2, Download, QrCode, MessageCircle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLAY_STORE_ID = 'com.bek.portal';

const SITE = 'https://bek-portal.vercel.app';

const waText = encodeURIComponent(
`🇩🇿 Salam ! Découvrez le Portail Citoyen de Bordj El Kiffan !

✅ Signaler un problème 📍
💡 Proposer des idées 
🤝 Entraide et bénévolat

👉 ${SITE}

« Ensemble pour le bien des citoyens et du pays » ✦`
);

const fbText = encodeURIComponent(
`🇩🇿 Votre voix compte pour Bordj El Kiffan !

Découvrez le Portail Citoyen de Bordj El Kiffan :

📍 Signaler les anomalies en un clic
💡 Proposer des projets d'amélioration
🤝 Participer aux actions d'entraide
📊 Suivre les interventions en temps réel

✅ +2 140 citoyens participent déjà !
✅ +564 problèmes résolus !

👉 ${SITE}

#BordjElKiffan #Algérie #ParticipationCitoyenne`
);

const waDecoded = decodeURIComponent(waText);
const fbDecoded = decodeURIComponent(fbText);

export default function Campagne() {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('📋 Copié !');
    } catch {
      prompt('Copie ce texte :', text);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container section" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold-light)' }}>📢 Campagne</span>
          <h2 style={{ marginTop: '0.5rem' }}>Faites connaître le Portail Citoyen</h2>
          <p style={{ color: 'var(--text-400)', marginTop: '0.5rem' }}>Partagez le site avec vos proches, groupes et quartier</p>
        </div>

        {/* QR */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '1.5rem' }}>
          <QrCode size={28} style={{ color: 'var(--clr-gold-light)' }} />
          <h3 style={{ margin: '0.5rem 0 0.25rem' }}>Scannez pour accéder au site</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Ouvrez l'appareil photo de votre téléphone sur ce QR code</p>
          <img src="/qr-bek.png" alt="QR Code BEK" style={{ width: 200, height: 200, margin: '1rem auto', borderRadius: 12, border: '2px solid var(--clr-gold)', display: 'block' }} />
          <code style={{ color: 'var(--clr-gold-light)', fontSize: '0.9rem' }}>{SITE}</code>
        </div>

        {/* Play Store */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--clr-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Smartphone size={24} style={{ color: 'var(--clr-gold-light)' }} />
            <h3 style={{ margin: 0 }}>Application Android</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', marginBottom: '0.75rem' }}>
            Téléchargez l'application BEK sur votre téléphone pour un accès rapide
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
            <a href={`https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Download size={16} /> Google Play
            </a>
            <a href="/bek-android-app.aab" className="btn btn-secondary" download>
              <Download size={16} /> .aab (manuel)
            </a>
            <a href="/bek-android-app.apk" className="btn btn-secondary" download>
              <Download size={16} /> .apk (test)
            </a>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-500)', textAlign: 'center', padding: '0.5rem', background: 'var(--bg-900)', borderRadius: 6 }}>
            ⏳ Publication Play Store en cours — le .aab sera disponible dès validation par Google.
          </div>
        </div>

        {/* WhatsApp */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #25D366' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <MessageCircle size={24} style={{ color: '#25D366' }} />
            <h3 style={{ margin: 0 }}>WhatsApp</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', marginBottom: '0.75rem' }}>Copiez ce message et envoyez-le dans vos groupes</p>
          <div style={{ background: 'var(--bg-900)', padding: '1rem', borderRadius: 8, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{waDecoded}</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#25D366', color: '#000' }}>
              <MessageCircle size={16} /> Ouvrir WhatsApp
            </a>
            <button className="btn btn-secondary" onClick={() => copy(waDecoded)}>
              <Share2 size={16} /> Copier
            </button>
          </div>
        </div>

        {/* Facebook */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #1877F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📘</span>
            <h3 style={{ margin: 0 }}>Facebook</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', marginBottom: '0.75rem' }}>Publiez dans les groupes de Bordj El Kiffan</p>
          <div style={{ background: 'var(--bg-900)', padding: '1rem', borderRadius: 8, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{fbDecoded}</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href={`https://facebook.com/sharer/sharer.php?quote=${fbText}&u=${encodeURIComponent(SITE)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#1877F2' }}>
              <span>📘</span> Partager sur Facebook
            </a>
            <button className="btn btn-secondary" onClick={() => copy(fbDecoded)}>
              <Share2 size={16} /> Copier
            </button>
          </div>
        </div>

        {/* Instagram */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #E4405F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📸</span>
            <h3 style={{ margin: 0 }}>Instagram</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', marginBottom: '0.75rem' }}>Copiez ce texte dans votre bio Instagram</p>
          <div style={{ background: 'var(--bg-900)', padding: '1rem', borderRadius: 8, fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            Portail Citoyen Bordj El Kiffan 🇩🇿<br />Signalez • Proposez • Participez<br />👇 Lien<br />{SITE}
          </div>
          <button className="btn btn-secondary" onClick={() => copy(`Portail Citoyen Bordj El Kiffan 🇩🇿\nSignalez • Proposez • Participez\n👇 Lien\n${SITE}`)}>
            <Share2 size={16} /> Copier la bio
          </button>
        </div>

        {/* Téléchargements */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Download size={24} style={{ color: 'var(--clr-gold-light)' }} />
            <h3 style={{ margin: 0 }}>Téléchargements</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <a href="/qr-bek.png" className="btn btn-outline" style={{ textAlign: 'center' }} download>📷 QR Code</a>
            <Link to="/kit-media" className="btn btn-outline" style={{ textAlign: 'center' }}>🎨 Kit média</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
