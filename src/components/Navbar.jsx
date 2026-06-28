import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Navbar.css';

const navLinks = [
  { to: '/',            key: 'accueil' },
  { to: '/signalements', key: 'signalements' },
  { to: '/propositions', key: 'propositions' },
  { to: '/projets',      key: 'projets' },
  { to: '/entraide',     key: 'entraide' },
  { to: '/actualites',   key: 'actualites' },
  { to: '/apropos',      key: 'apropos' },
  { to: '/soutenir',     key: 'soutenir' },
  { to: '/annuaire',     key: 'annuaire' },
  { to: '/premium',      key: 'premium' },
  { to: '/contact',      key: 'contact' },
  { to: '/admin/ads',    key: 'publicite' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ nom: '', email: '' });
  const [regMessage, setRegMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { state, dispatch, registerMember } = useApp();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogin = () => {
    setShowLogin(true);
    setLoginPassword('');
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      dispatch({ type: 'LOGIN', payload: { user: { name: data.user.role === 'superadmin' ? 'Super Admin' : 'Admin', role: data.user.role, avatar: '/admin_profile_1780909824483.png' }, token: data.token } });
      setShowLogin(false);
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.nom.trim()) return;
    const result = await registerMember({ nom: regForm.nom.trim(), email: regForm.email.trim() || undefined });
    setRegForm({ nom: '', email: '' });
    if (result?.success) {
      setRegMessage(t('nav.register_success'));
    } else {
      setRegMessage(t('nav.register_error'));
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-flag">🇩🇿</span>
          <span className="logo-text">
            <strong>BEK</strong>
            <small>{t('nav.logo_title')}</small>
          </span>
        </Link>

        <ul className="navbar-links hide-mobile">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>
                {t(`nav.${l.key}`)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <LanguageSwitcher />
          {state.user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-trigger" onClick={() => setShowDropdown(p => !p)}>
                <img src={state.user.avatar} alt={state.user.name} className="avatar" style={{ width: 32, height: 32 }} />
                <span className="hide-mobile">{state.user.name}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} />
              </button>
              {showDropdown && (
                <div className="admin-dropdown animate-fade">
                  <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    {t('nav.admin_dashboard')}
                  </Link>
                  <Link to="/admin/membres" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    {t('nav.admin_membres')}
                  </Link>
                  <Link to="/admin/ads" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    {t('nav.admin_publicites')}
                  </Link>
                  {state.user.role === 'superadmin' && (
                    <Link to="/admin/users" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      {t('nav.admin_admins')}
                    </Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={() => { setShowDropdown(false); dispatch({ type: 'LOGOUT' }); }}>
                    {t('nav.deconnexion')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-sm btn-secondary hide-mobile" onClick={handleLogin}>
                {t('nav.connexion')}
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => setShowRegister(true)}>
                {t('nav.rejoindre')}
              </button>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu animate-fade">
          <ul>
            {navLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={`mobile-link ${location.pathname === l.to ? 'active' : ''}`}>
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <LanguageSwitcher mobile />
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!state.user ? (
                <>
                  <button className="btn btn-sm btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
                    {t('nav.connexion')}
                  </button>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowRegister(true)}>
                    {t('nav.rejoindre')}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-center" style={{ gap: '0.6rem', padding: '0.5rem 0' }}>
                    <img src={state.user.avatar} alt={state.user.name} className="avatar" style={{ width: 36, height: 36 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-200)' }}>{state.user.name}</span>
                  </div>
                  {state.user?.role && (
                    <>
                      <Link to="/admin/dashboard" className="btn btn-sm btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                        {t('nav.admin_panneau')}
                      </Link>
                      <Link to="/admin/membres" className="btn btn-sm btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                        {t('nav.admin_gerer_membres')}
                      </Link>
                      <Link to="/admin/ads" className="btn btn-sm btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                        {t('nav.admin_publicites')}
                      </Link>
                      {state.user.role === 'superadmin' && (
                        <Link to="/admin/users" className="btn btn-sm btn-secondary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                          {t('nav.admin_gerer_admins')}
                        </Link>
                      )}
                    </>
                  )}
                  <button className="btn btn-sm btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--clr-red-light)' }}
                    onClick={() => dispatch({ type: 'LOGOUT' })}>
                    {t('nav.deconnexion')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay" onClick={() => { setShowLogin(false); setLoginError(''); }}>
          <div className="modal card" style={{ maxWidth: 400, padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3>{t('nav.login_title')}</h3>
            <form onSubmit={handleLoginSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>{t('nav.login_label')}</label>
                <input type="password" className="form-control" placeholder={t('nav.login_placeholder')} required autoFocus
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              </div>
              {loginError && <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>{loginError}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {t('nav.login_submit')}
              </button>
              <button type="button" className="btn btn-sm btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => { setShowLogin(false); setLoginError(''); }}>
                {t('nav.login_cancel')}
              </button>
            </form>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => { setShowRegister(false); setRegMessage(''); }}>
          <div className="modal card" style={{ maxWidth: 420, padding: '2rem' }} onClick={e => e.stopPropagation()}>
            {regMessage ? (
              <>
                <div className="alert alert-success">{regMessage}</div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => { setShowRegister(false); setRegMessage(''); }}>
                  {t('nav.register_close')}
                </button>
              </>
            ) : (
              <>
                <h3>{t('nav.register_title')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-400)', margin: '0.5rem 0 1.5rem' }}>
                  {t('nav.register_desc')}
                </p>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label>{t('nav.register_nom_label')}</label>
                    <input type="text" className="form-control" placeholder={t('nav.register_nom_placeholder')} required
                      value={regForm.nom} onChange={e => setRegForm(f => ({ ...f, nom: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>{t('nav.register_email_label')}</label>
                    <input type="email" className="form-control" placeholder={t('nav.register_email_placeholder')}
                      value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    {t('nav.register_submit')}
                  </button>
                  <button type="button" className="btn btn-sm btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => { setShowRegister(false); setRegMessage(''); }}>
                    {t('nav.register_cancel')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
