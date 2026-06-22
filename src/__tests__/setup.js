import { vi } from 'vitest';

const fakeData = {
  signalements: [
    { id: 1, titre: 'Nid de poule sur la route principale', categorie: 'Voirie et routes', statut: 'En cours', votes: 24, description: 'Grande route endommagée près du marché central.', quartier: 'Cité des fleurs' },
    { id: 2, titre: 'Panne d\'éclairage rue Ben Youcef', categorie: 'Éclairage public', statut: 'Résolu', votes: 18, description: '5 lampadaires éteints depuis 2 semaines.', quartier: 'Centre-ville' },
    { id: 3, titre: 'Décharges sauvages sur le boulevard', categorie: 'Propreté et environnement', statut: 'Nouveau', votes: 31, description: 'Accumulation de déchets non collectés.', quartier: 'Quartier El Bahri' },
    { id: 4, titre: 'Absence de transport le week-end', categorie: 'Transport', statut: 'En attente', votes: 45, description: 'Pas de bus les vendredis matin.', quartier: 'Cité Universitaire' },
  ],
  propositions: [
    { id: 1, titre: 'Installer des caméras de surveillance dans les parcs', categorie: 'Sécurité', votes: 87, commentaires: 12, auteur: 'Citoyen engagé', description: 'Pour améliorer la sécurité des espaces publics.' },
    { id: 2, titre: 'Créer une ligne de bus express vers le centre', categorie: 'Transport', votes: 124, commentaires: 23, auteur: 'Association BEK', description: 'Réduire la congestion et faciliter les déplacements.' },
    { id: 3, titre: 'Planter 500 arbres dans les quartiers', categorie: 'Propreté et environnement', votes: 201, commentaires: 34, auteur: 'Club Écologie', description: 'Améliorer la qualité de l\'air et l\'ombre en été.' },
  ],
  entraide: [
    { id: 1, type: 'Bénévolat', titre: 'Aide aux devoirs pour élèves', auteur: 'Prof. Karim', contact: 'karim@email.com', description: 'Disponible les mercredis après-midi.' },
    { id: 2, type: 'Expertise professionnelle', titre: 'Conseil juridique gratuit', auteur: 'Me. Fatima', contact: 'fatima@email.com', description: 'Consultations juridiques pour les citoyens.' },
    { id: 3, type: 'Aide matérielle', titre: 'Dons de vêtements d\'hiver', auteur: 'Association Rahma', contact: 'rahma@email.com', description: 'Distribution gratuite le vendredi.' },
  ],
  membres: [
    { id: 1, nom: 'Ahmed', email: 'ahmed@email.com', date_inscription: '2026-06-01' },
    { id: 2, nom: 'Sara', email: 'sara@email.com', date_inscription: '2026-06-02' },
    { id: 3, nom: 'Mohamed', email: 'mohamed@email.com', date_inscription: '2026-06-03' },
  ],
};

let fetchCallCount = 0;

globalThis.fetch = vi.fn((url, options) => {
  fetchCallCount++;
  const match = url.match(/\/api\/data\/(\w+)/);
  const table = match ? match[1] : null;

  if (!options || options.method === 'GET' || !options.method) {
    const data = fakeData[table] || [];
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data }),
    });
  }

  if (options.method === 'POST') {
    const body = JSON.parse(options.body);
    const newItem = { id: Date.now() + fetchCallCount, ...body };
    if (fakeData[table]) fakeData[table].unshift(newItem);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: newItem }),
    });
  }

  if (options.method === 'PATCH') {
    const body = JSON.parse(options.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: body }),
    });
  }

  if (options.method === 'DELETE') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ deleted: true }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  });
});

export function resetFetchMock() {
  fetchCallCount = 0;
}
