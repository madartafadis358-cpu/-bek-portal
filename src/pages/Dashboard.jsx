import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useApp } from '../context/AppContext.jsx';
import { CheckCircle, AlertTriangle, Lightbulb, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { state } = useApp();
  const { stats, signalements, propositions } = state;

  // Compute actual counts from live state
  const liveSignalements = signalements.length;
  const livePropositions = propositions.length;

  // Status mapping for live list
  const statusCounts = signalements.reduce(
    (acc, curr) => {
      if (curr.statut === 'Résolu') acc.resolu++;
      else if (curr.statut === 'En cours') acc.enCours++;
      else acc.autre++;
      return acc;
    },
    { resolu: 0, enCours: 0, autre: 0 }
  );

  // Chart 1: Status Distribution (Doughnut)
  const statusData = {
    labels: ['Résolus', 'En cours', 'Nouveaux & En attente'],
    datasets: [
      {
        data: [
          stats.resolus + statusCounts.resolu,
          200 + statusCounts.enCours,
          83 + statusCounts.autre,
        ],
        backgroundColor: [
          'rgba(34, 139, 34, 0.75)', // HSL Green
          'rgba(59, 130, 246, 0.75)', // Blue
          'rgba(255, 193, 7, 0.75)',  // Gold/Yellow
        ],
        borderColor: [
          'hsl(145, 63%, 55%)',
          '#60a5fa',
          'hsl(42,  95%, 58%)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Signalements by Category (Bar)
  const categoriesMap = signalements.reduce((acc, curr) => {
    acc[curr.categorie] = (acc[curr.categorie] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: [
      'Voirie',
      'Éclairage',
      'Propreté',
      'Sécurité',
      'Transport',
      'Urbanisme',
      'Autres',
    ],
    datasets: [
      {
        label: 'Nombre de signalements',
        data: [
          (categoriesMap['Voirie et routes'] || 0) + 250,
          (categoriesMap['Éclairage public'] || 0) + 180,
          (categoriesMap['Propreté et environnement'] || 0) + 210,
          (categoriesMap['Sécurité'] || 0) + 95,
          (categoriesMap['Transport'] || 0) + 70,
          (categoriesMap['Urbanisme'] || 0) + 30,
          (categoriesMap['Autres'] || 0) + 12,
        ],
        backgroundColor: 'rgba(34, 139, 34, 0.5)',
        borderColor: 'hsl(145, 63%, 55%)',
        borderWidth: 1,
      },
    ],
  };

  // Chart 3: Active Members Trend (Line)
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Nombre de citoyens inscrits',
        data: [1500, 1800, 2100, 2250, 2300, stats.membres],
        fill: true,
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderColor: 'hsl(42,  95%, 58%)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(210, 25%, 85%)', // --text-200
          font: {
            family: 'Inter',
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'hsl(210, 15%, 65%)', // --text-300
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'hsl(210, 15%, 65%)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'hsl(210, 25%, 85%)',
          font: {
            family: 'Inter',
          },
        },
      },
    },
  };

  return (
    <div className="page-wrapper container section">
      <div className="section-title">
        <span className="overline">Statistiques et Impact</span>
        <h2>Tableau de bord citoyen</h2>
        <div className="divider" />
        <p>
          Visualisez l'impact de la participation citoyenne à Bordj El Kiffan.
          Suivez la résolution des problèmes et la progression des initiatives locales.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--clr-red-light)' }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.signalements + liveSignalements}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Total Signalements</p>
        </div>

        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--clr-green-glow)' }}>
            <CheckCircle size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.resolus + statusCounts.resolu}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Problèmes Résolus</p>
        </div>

        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--clr-gold)' }}>
            <Lightbulb size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.propositions + livePropositions}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Propositions soumises</p>
        </div>

        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#60a5fa' }}>
            <Users size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.membres}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Citoyens Actifs</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '3rem' }} className="grid-responsive-layout">
        
        {/* Chart 1: Status (Doughnut) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3>Statut de traitement des signalements</h3>
          <div style={{ height: '300px', position: 'relative' }}>
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Chart 2: Category Breakdown (Bar) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3>Signalements par catégorie</h3>
          <div style={{ height: '300px', position: 'relative' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 3: Active Members (Line) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / -1' }}>
          <h3>Évolution de la communauté citoyenne</h3>
          <div style={{ height: '300px', position: 'relative' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Local administrative accountability section */}
      <div className="card grid-responsive-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem', padding: '2.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Engagement municipal</h3>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Toutes les préoccupations citoyennes publiées sur cette plateforme font l'objet d'un suivi transparent.
            L'équipe d'administration présidée par <strong>Brik Chaouche Mourad</strong> collabore avec les différents comités de quartier
            et services techniques de la commune de Bordj El Kiffan pour planifier les chantiers et coordonner les actions d'entraide.
          </p>
          <div style={{ background: 'var(--bg-900)', borderRadius: 'var(--radius-sm)', padding: '1rem', borderLeft: '3px solid var(--clr-gold)' }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--clr-gold-light)', marginBottom: '0.25rem' }}>Indice de satisfaction globale</strong>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>88.6 %</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginLeft: '0.5rem' }}>(Basé sur les signalements résolus)</span>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Dernières résolutions &amp; Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { text: "Réfection de la voirie endommagée à la Cité des fleurs suite aux signalements répétés.", date: "Il y a 2 jours", type: "Résolution" },
              { text: "Installation de 5 nouveaux lampadaires LED dans la rue Ben Youcef.", date: "Il y a 5 jours", type: "Résolution" },
              { text: "Collecte de 2 tonnes de déchets sur le littoral lors de la journée citoyenne de nettoyage.", date: "Il y a 6 jours", type: "Nettoyage" },
              { text: "Finalisation du plan de réhabilitation du parc municipal avec la participation de 12 bénévoles.", date: "Il y a 1 semaine", type: "Planification" }
            ].map((action, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: idx < 3 ? '1px solid var(--glass-border)' : 'none', paddingBottom: idx < 3 ? '1rem' : '0' }}>
                <span className={`badge ${action.type === 'Résolution' ? 'badge-green' : action.type === 'Nettoyage' ? 'badge-blue' : 'badge-gold'}`} style={{ marginTop: '3px' }}>{action.type}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-200)', margin: 0 }}>{action.text}</p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>{action.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
