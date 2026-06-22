import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Signalements from './pages/Signalements.jsx';
import Propositions from './pages/Propositions.jsx';
import Projets from './pages/Projets.jsx';
import Entraide from './pages/Entraide.jsx';
import Actualites from './pages/Actualites.jsx';
import APropos from './pages/APropos.jsx';
import Campagne from './pages/Campagne.jsx';
import GuideCitoyen from './pages/GuideCitoyen.jsx';
import Contact from './pages/Contact.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminMembres from './pages/AdminMembres.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Soutenir from './pages/Soutenir.jsx';
import Annuaire from './pages/Annuaire.jsx';
import Premium from './pages/Premium.jsx';
import AdsManager from './pages/admin/AdsManager.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdBanner from './components/ads/AdBanner.jsx';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="container"><AdBanner placement="header" /></div>
      <div className="app-layout">
        <main className="app-content">
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
        </main>
        <aside className="app-sidebar">
          <AdBanner placement="sidebar" />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
