import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdBanner from './components/ads/AdBanner.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Signalements = lazy(() => import('./pages/Signalements.jsx'));
const Propositions = lazy(() => import('./pages/Propositions.jsx'));
const Projets = lazy(() => import('./pages/Projets.jsx'));
const Entraide = lazy(() => import('./pages/Entraide.jsx'));
const Actualites = lazy(() => import('./pages/Actualites.jsx'));
const APropos = lazy(() => import('./pages/APropos.jsx'));
const Campagne = lazy(() => import('./pages/Campagne.jsx'));
const GuideCitoyen = lazy(() => import('./pages/GuideCitoyen.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminMembres = lazy(() => import('./pages/AdminMembres.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const Soutenir = lazy(() => import('./pages/Soutenir.jsx'));
const Annuaire = lazy(() => import('./pages/Annuaire.jsx'));
const Premium = lazy(() => import('./pages/Premium.jsx'));
const AdsManager = lazy(() => import('./pages/admin/AdsManager.jsx'));
const AdminUsers = lazy(() => import('./pages/AdminUsers.jsx'));

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="container"><AdBanner placement="header" /></div>
      <div className="app-layout">
        <main className="app-content">
          <Suspense fallback={<div className="loading-spinner">Chargement...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signalements" element={<Signalements />} />
              <Route path="/propositions" element={<Propositions />} />
              <Route path="/projets" element={<Projets />} />
              <Route path="/entraide" element={<Entraide />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/apropos" element={<APropos />} />
              <Route path="/campagne" element={<Campagne />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guide" element={<GuideCitoyen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/membres" element={<AdminMembres />} />
              <Route path="/admin/ads" element={<AdsManager />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/annuaire" element={<Annuaire />} />
              <Route path="/premium" element={<Premium />} />
            </Routes>
          </Suspense>
        </main>
        <aside className="app-sidebar">
          <AdBanner placement="sidebar" />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
