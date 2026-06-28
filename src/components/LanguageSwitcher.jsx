import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const langs = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ar', label: 'العربية',  flag: '🇩🇿' },
  { code: 'ber', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: 'ⵣ' },
];

export default function LanguageSwitcher({ mobile }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('bek-lang', code);
    setOpen(false);
    window.location.reload();
  };

  const current = langs.find((l) => l.code === i18n.language) || langs[0];

  if (mobile) {
    return (
      <div style={{ borderTop: '1px solid var(--glass-border)', padding: '1rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-500)', display: 'block', marginBottom: '0.6rem' }}>Langue</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {langs.map((l) => (
            <button key={l.code}
              style={{
                padding: '0.35rem 0.6rem', borderRadius: 'var(--radius)', border: `1px solid ${i18n.language === l.code ? 'rgba(34,139,34,0.4)' : 'var(--glass-border)'}`,
                background: i18n.language === l.code ? 'rgba(34,139,34,0.15)' : 'transparent',
                color: i18n.language === l.code ? 'var(--clr-green-glow)' : 'var(--text-300)',
                fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: i18n.language === l.code ? 600 : 400,
              }}
              onClick={() => switchLang(l.code)}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="lang-trigger" onClick={() => setOpen((p) => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.5rem',
          borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)',
          background: 'transparent', color: 'var(--text-300)', fontSize: '0.8rem',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
        }}
      >
        <Globe size={14} />
        <span>{current.flag}</span>
        <span style={{ fontWeight: 500 }}>{current.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="animate-fade" style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '0.3rem',
          background: 'var(--bg-800)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)', minWidth: 140, overflow: 'hidden', zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}>
          {langs.map((l) => (
            <button key={l.code} onClick={() => switchLang(l.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                padding: '0.55rem 0.8rem', border: 'none', background: i18n.language === l.code ? 'rgba(34,139,34,0.12)' : 'transparent',
                color: i18n.language === l.code ? 'var(--clr-green-glow)' : 'var(--text-200)',
                fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { e.target.style.background = i18n.language === l.code ? 'rgba(34,139,34,0.12)' : 'transparent'; }}
            >
              <span style={{ fontSize: '1rem' }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
