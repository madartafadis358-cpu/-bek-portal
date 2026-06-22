import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';

const AppContext = createContext(null);

const API_BASE = '/api/data';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur API');
  return json;
}

const seedData = {
  signalements: [
    { titre: 'Nid de poule sur la route principale', categorie: 'Voirie et routes', statut: 'En cours', votes: 24, description: 'Grande route endommagée près du marché central.', quartier: 'Cité des fleurs' },
    { titre: 'Panne d\'éclairage rue Ben Youcef', categorie: 'Éclairage public', statut: 'Résolu', votes: 18, description: '5 lampadaires éteints depuis 2 semaines.', quartier: 'Centre-ville' },
    { titre: 'Décharges sauvages sur le boulevard', categorie: 'Propreté et environnement', statut: 'Nouveau', votes: 31, description: 'Accumulation de déchets non collectés.', quartier: 'Quartier El Bahri' },
    { titre: 'Absence de transport le week-end', categorie: 'Transport', statut: 'En attente', votes: 45, description: 'Pas de bus les vendredis matin.', quartier: 'Cité Universitaire' },
  ],
  propositions: [
    { titre: 'Installer des caméras de surveillance dans les parcs', categorie: 'Sécurité', votes: 87, commentaires: 12, auteur: 'Citoyen engagé', description: 'Pour améliorer la sécurité des espaces publics.' },
    { titre: 'Créer une ligne de bus express vers le centre', categorie: 'Transport', votes: 124, commentaires: 23, auteur: 'Association BEK', description: 'Réduire la congestion et faciliter les déplacements.' },
    { titre: 'Planter 500 arbres dans les quartiers', categorie: 'Propreté et environnement', votes: 201, commentaires: 34, auteur: 'Club Écologie', description: 'Améliorer la qualité de l\'air et l\'ombre en été.' },
  ],
  entraide: [
    { type: 'Bénévolat', titre: 'Aide aux devoirs pour élèves', auteur: 'Prof. Karim', contact: 'karim@email.com', description: 'Disponible les mercredis après-midi.' },
    { type: 'Expertise professionnelle', titre: 'Conseil juridique gratuit', auteur: 'Me. Fatima', contact: 'fatima@email.com', description: 'Consultations juridiques pour les citoyens.' },
    { type: 'Aide matérielle', titre: 'Dons de vêtements d\'hiver', auteur: 'Association Rahma', contact: 'rahma@email.com', description: 'Distribution gratuite le vendredi.' },
  ],
  projets: [
    { titre: 'Réhabilitation du parc municipal', objectif: 'Rénover le parc central pour les familles', avancement: 65, benevoles: 12, statut: 'Actif', date: '2026-04-10', description: 'Rénovation des allées, bancs, aires de jeux.' },
    { titre: 'Bibliothèque communautaire', objectif: 'Ouvrir une bibliothèque de quartier gratuite', avancement: 40, benevoles: 8, statut: 'Actif', date: '2026-05-01', description: 'Collecte de livres et aménagement du local.' },
    { titre: 'Formation numérique pour seniors', objectif: 'Initier 100 seniors à internet', avancement: 80, benevoles: 5, statut: 'Actif', date: '2026-03-15', description: 'Ateliers hebdomadaires gratuits.' },
  ],
  actualites: [
    { titre: 'Journée de nettoyage citoyenne — Grand succès !', categorie: 'Événement', date: '2026-06-05', image: null, description: 'Plus de 200 volontaires ont participé à la grande journée de nettoyage du littoral de Bordj El Kiffan.' },
    { titre: 'Inauguration du nouveau centre de santé', categorie: 'Réalisation', date: '2026-05-30', image: null, description: 'Le nouveau centre de santé de proximité a ouvert ses portes.' },
    { titre: 'Appel aux bénévoles — Fête de quartier', categorie: 'Appel', date: '2026-06-10', image: null, description: 'La commune cherche des bénévoles pour l\'animation.' },
  ],
};

const BASE_MEMBRES = 2371;

const initialState = {
  user: null,
  token: null,
  signalements: [],
  propositions: [],
  projets: [
    { id: 1, titre: 'Réhabilitation du parc municipal', objectif: 'Rénover le parc central pour les familles', avancement: 65, benevoles: 12, statut: 'Actif', date: '2026-04-10', description: 'Rénovation des allées, bancs, aires de jeux.' },
    { id: 2, titre: 'Bibliothèque communautaire', objectif: 'Ouvrir une bibliothèque de quartier gratuite', avancement: 40, benevoles: 8, statut: 'Actif', date: '2026-05-01', description: 'Collecte de livres et aménagement du local.' },
    { id: 3, titre: 'Formation numérique pour seniors', objectif: 'Initier 100 seniors à internet', avancement: 80, benevoles: 5, statut: 'Actif', date: '2026-03-15', description: 'Ateliers hebdomadaires gratuits.' },
  ],
  entraide: [],
  actualites: [
    { id: 1, titre: 'Journée de nettoyage citoyenne — Grand succès !', categorie: 'Événement', date: '2026-06-05', image: null, description: 'Plus de 200 volontaires ont participé à la grande journée de nettoyage du littoral de Bordj El Kiffan.' },
    { id: 2, titre: 'Inauguration du nouveau centre de santé', categorie: 'Réalisation', date: '2026-05-30', image: null, description: 'Le nouveau centre de santé de proximité a ouvert ses portes.' },
    { id: 3, titre: 'Appel aux bénévoles — Fête de quartier', categorie: 'Appel', date: '2026-06-10', image: null, description: 'La commune cherche des bénévoles pour l\'animation.' },
  ],
  membres: [],
  stats: { signalements: 0, propositions: 0, projets: 0, benevoles: 0, resolus: 0, membres: BASE_MEMBRES },
  loading: true,
};

function computeStats(signalements, propositions, entraide, membres, projets = []) {
  return {
    signalements: signalements.length,
    propositions: propositions.length,
    projets: projets.length,
    benevoles: entraide.filter(e => e.type === 'Bénévolat').length,
    resolus: signalements.filter(s => s.statut === 'Résolu').length,
    membres: (membres || []).filter(m => m.statut === 'valide').length + BASE_MEMBRES,
  };
}

function updateStatsOnDelete(type, state, id) {
  const base = { ...state.stats };
  if (type === 'signalements') {
    const deleted = state.signalements.find(s => s.id === id);
    return {
      signalements: base.signalements - 1,
      resolus: base.resolus - (deleted?.statut === 'Résolu' ? 1 : 0),
      propositions: base.propositions,
      projets: base.projets,
      benevoles: base.benevoles,
      membres: base.membres,
    };
  }
  if (type === 'propositions') return { ...base, propositions: base.propositions - 1 };
  if (type === 'entraide') return { ...base, benevoles: state.entraide.filter(e => e.id !== id && e.type === 'Bénévolat').length };
  if (type === 'membres') return { ...base, membres: state.membres.filter(m => m.id !== id && m.statut === 'valide').length + BASE_MEMBRES };
  if (type === 'projets') return { ...base, projets: base.projets - 1 };
  return base;
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOADED':
      return { ...state, ...action.payload, loading: false };
    case 'LOGIN':
      return { ...state, user: action.payload.user || action.payload, token: action.payload.token || null };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    case 'REGISTER_MEMBER':
      return { ...state, membres: [action.payload, ...state.membres] };
    case 'UPDATE_MEMBER_STATUT': {
      const membres = state.membres.map(m => m.id === action.payload.id ? { ...m, statut: action.payload.statut } : m);
      const valides = membres.filter(m => m.statut === 'valide').length + BASE_MEMBRES;
      return { ...state, membres, stats: { ...state.stats, membres: valides } };
    }
    case 'ADD_SIGNALEMENT':
      return {
        ...state,
        signalements: [{ ...action.payload, id: Date.now(), date: new Date().toISOString().slice(0, 10), votes: 0, statut: 'Nouveau' }, ...state.signalements],
        stats: { ...state.stats, signalements: state.stats.signalements + 1 },
      };
    case 'VOTE_SIGNALEMENT':
      return { ...state, signalements: state.signalements.map(s => s.id === action.payload ? { ...s, votes: s.votes + 1 } : s) };
    case 'ADD_PROPOSITION':
      return {
        ...state,
        propositions: [{ ...action.payload, id: Date.now(), date: new Date().toISOString().slice(0, 10), votes: 0, commentaires: 0 }, ...state.propositions],
        stats: { ...state.stats, propositions: state.stats.propositions + 1 },
      };
    case 'VOTE_PROPOSITION':
      return { ...state, propositions: state.propositions.map(p => p.id === action.payload ? { ...p, votes: p.votes + 1 } : p) };
    case 'ADD_ENTRAIDE':
      return { ...state, entraide: [{ ...action.payload, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...state.entraide] };
    case 'DELETE_SIGNALEMENT':
      return { ...state, signalements: state.signalements.filter(s => s.id !== action.payload), stats: updateStatsOnDelete('signalements', state, action.payload) };
    case 'DELETE_PROPOSITION':
      return { ...state, propositions: state.propositions.filter(p => p.id !== action.payload), stats: updateStatsOnDelete('propositions', state, action.payload) };
    case 'DELETE_ENTRAIDE':
      return { ...state, entraide: state.entraide.filter(e => e.id !== action.payload), stats: updateStatsOnDelete('entraide', state, action.payload) };
    case 'DELETE_MEMBRE':
      return { ...state, membres: state.membres.filter(m => m.id !== action.payload), stats: updateStatsOnDelete('membres', state, action.payload) };
    case 'DELETE_PROJET':
      return { ...state, projets: state.projets.filter(p => p.id !== action.payload), stats: updateStatsOnDelete('projets', state, action.payload) };
    case 'ADD_PROJET':
      return { ...state, projets: [{ ...action.payload, id: action.payload.id || Date.now() }, ...state.projets], stats: { ...state.stats, projets: state.stats.projets + 1 } };
    case 'ADD_ACTUALITE':
      return { ...state, actualites: [{ ...action.payload, id: action.payload.id || Date.now() }, ...state.actualites] };
    case 'DELETE_ACTUALITE':
      return { ...state, actualites: state.actualites.filter(a => a.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const tables = ['signalements', 'propositions', 'entraide', 'membres', 'projets', 'actualites'];
        const results = await Promise.all(tables.map(t =>
          apiFetch(`${API_BASE}/${t}`).catch(() => ({ data: null }))
        ));

        const [sigRes, propRes, entRes, memRes, projRes, actRes] = results;
        const sigData = sigRes?.data || [];
        const propData = propRes?.data || [];
        const entData = entRes?.data || [];
        const memData = memRes?.data || [];
        let projData = projRes?.data || [];
        let actData = actRes?.data || [];

        if (sigData.length > 0) {
          if (projData.length === 0) {
            projData = (await Promise.all(seedData.projets.map(p =>
              apiFetch(`${API_BASE}/projets`, { method: 'POST', body: JSON.stringify(p) }).then(r => r.data).catch(() => p)
            ))) || seedData.projets;
          }
          if (actData.length === 0) {
            actData = (await Promise.all(seedData.actualites.map(a =>
              apiFetch(`${API_BASE}/actualites`, { method: 'POST', body: JSON.stringify(a) }).then(r => r.data).catch(() => a)
            ))) || seedData.actualites;
          }
        } else {
          const inserts = await Promise.all([
            Promise.all(seedData.signalements.map(s => apiFetch(`${API_BASE}/signalements`, { method: 'POST', body: JSON.stringify(s) }).then(r => r.data).catch(() => s))),
            Promise.all(seedData.propositions.map(p => apiFetch(`${API_BASE}/propositions`, { method: 'POST', body: JSON.stringify(p) }).then(r => r.data).catch(() => p))),
            Promise.all(seedData.entraide.map(e => apiFetch(`${API_BASE}/entraide`, { method: 'POST', body: JSON.stringify(e) }).then(r => r.data).catch(() => e))),
            Promise.all(seedData.projets.map(p => apiFetch(`${API_BASE}/projets`, { method: 'POST', body: JSON.stringify(p) }).then(r => r.data).catch(() => p))),
            Promise.all(seedData.actualites.map(a => apiFetch(`${API_BASE}/actualites`, { method: 'POST', body: JSON.stringify(a) }).then(r => r.data).catch(() => a))),
          ]);
          sigData.push(...inserts[0]);
          propData.push(...inserts[1]);
          entData.push(...inserts[2]);
          projData = inserts[3];
          actData = inserts[4];
        }

        dispatch({ type: 'LOADED', payload: {
          signalements: sigData, propositions: propData, projets: projData,
          actualites: actData, entraide: entData, membres: memData,
          stats: computeStats(sigData, propData, entData, memData, projData),
        }});
      } catch (err) {
        console.error('API load error:', err);
        dispatch({ type: 'LOADED', payload: {
          ...initialState, signalements: seedData.signalements,
          propositions: seedData.propositions, projets: seedData.projets,
          actualites: seedData.actualites, entraide: seedData.entraide,
          loading: false,
        }});
      }
    })();
  }, []);

  const addSignalement = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/signalements`, {
        method: 'POST', body: JSON.stringify(payload),
      });
      dispatch({ type: 'ADD_SIGNALEMENT', payload: data || payload });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const signalementsRef = useRef(state.signalements);
  signalementsRef.current = state.signalements;
  const propositionsRef = useRef(state.propositions);
  propositionsRef.current = state.propositions;

  const voteSignalement = useCallback(async (id) => {
    const s = signalementsRef.current.find(s => s.id === id);
    if (s) {
      try {
        await apiFetch(`${API_BASE}/signalements/${id}`, {
          method: 'PATCH', body: JSON.stringify({ votes: s.votes + 1 }),
        });
      } catch (err) { console.error('API error:', err); }
    }
    dispatch({ type: 'VOTE_SIGNALEMENT', payload: id });
  }, []);

  const addProposition = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/propositions`, {
        method: 'POST', body: JSON.stringify(payload),
      });
      dispatch({ type: 'ADD_PROPOSITION', payload: data || payload });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const voteProposition = useCallback(async (id) => {
    const p = propositionsRef.current.find(p => p.id === id);
    if (p) {
      try {
        await apiFetch(`${API_BASE}/propositions/${id}`, {
          method: 'PATCH', body: JSON.stringify({ votes: p.votes + 1 }),
        });
      } catch (err) { console.error('API error:', err); }
    }
    dispatch({ type: 'VOTE_PROPOSITION', payload: id });
  }, []);

  const addEntraide = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/entraide`, {
        method: 'POST', body: JSON.stringify(payload),
      });
      dispatch({ type: 'ADD_ENTRAIDE', payload: data || payload });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const registerMember = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/membres`, {
        method: 'POST', body: JSON.stringify({ nom: payload.nom, email: payload.email || null, statut: 'en_attente' }),
      });
      dispatch({ type: 'REGISTER_MEMBER', payload: data || { ...payload, id: Date.now(), date_inscription: new Date().toISOString().slice(0, 10), statut: 'en_attente' } });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const validateMember = useCallback(async (id) => {
    try {
      await apiFetch(`${API_BASE}/membres/${id}`, {
        method: 'PATCH', body: JSON.stringify({ statut: 'valide' }),
      });
      dispatch({ type: 'UPDATE_MEMBER_STATUT', payload: { id, statut: 'valide' } });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const rejectMember = useCallback(async (id) => {
    try {
      await apiFetch(`${API_BASE}/membres/${id}`, {
        method: 'PATCH', body: JSON.stringify({ statut: 'rejete' }),
      });
      dispatch({ type: 'UPDATE_MEMBER_STATUT', payload: { id, statut: 'rejete' } });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const deleteSignalement = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/signalements/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_SIGNALEMENT', payload: id });
  }, []);

  const deleteProposition = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/propositions/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_PROPOSITION', payload: id });
  }, []);

  const deleteEntraide = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/entraide/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_ENTRAIDE', payload: id });
  }, []);

  const deleteMembre = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/membres/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_MEMBRE', payload: id });
  }, []);

  const addProjet = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/projets`, {
        method: 'POST', body: JSON.stringify(payload),
      });
      dispatch({ type: 'ADD_PROJET', payload: data || payload });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const addActualite = useCallback(async (payload) => {
    try {
      const { data } = await apiFetch(`${API_BASE}/actualites`, {
        method: 'POST', body: JSON.stringify(payload),
      });
      dispatch({ type: 'ADD_ACTUALITE', payload: data || payload });
    } catch (err) { console.error('API error:', err); }
  }, []);

  const deleteProjet = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/projets/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_PROJET', payload: id });
  }, []);

  const deleteActualite = useCallback(async (id) => {
    try { await apiFetch(`${API_BASE}/actualites/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    dispatch({ type: 'DELETE_ACTUALITE', payload: id });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, addSignalement, voteSignalement, addProposition, voteProposition, addEntraide, registerMember, validateMember, rejectMember, deleteSignalement, deleteProposition, deleteEntraide, deleteMembre, addProjet, addActualite, deleteProjet, deleteActualite }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}