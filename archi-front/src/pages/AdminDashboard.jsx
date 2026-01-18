import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/graphql";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEvents: 0,
    ticketsSold: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.post("", {
      query: `
        query {
          adminStats {
            totalEvents
            ticketsSold
            revenue
          }
        }
      `,
    })
      .then(res => {
        if (res.data.errors) {
          setError("Erreur lors du chargement des statistiques");
        } else {
          setStats(res.data.data.adminStats);
        }
      })
      .catch(() => {
        setError("Impossible de contacter le serveur");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">

      {/* 🔙 BOUTON RETOUR */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                   bg-gray-700/60 hover:bg-gray-700 transition 
                   border border-gray-600 text-sm font-medium"
      >
        ← Retour
      </button>

      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">
        Dashboard Admin
      </h1>

      {/* ⏳ LOADING */}
      {loading && (
        <p className="text-gray-400 animate-pulse">
          Chargement des statistiques...
        </p>
      )}

      {/* ❌ ERREUR */}
      {error && (
        <p className="text-red-500 font-semibold bg-red-500/10 p-4 rounded-xl border border-red-500/30">
          {error}
        </p>
      )}

      {/* 📊 STATS */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Événements"
            value={stats.totalEvents}
            gradient="from-blue-500 to-blue-700"
          />

          <StatCard
            title="Tickets vendus"
            value={stats.ticketsSold}
            gradient="from-emerald-500 to-emerald-700"
          />

          <StatCard
            title="Revenus (MAD)"
            value={stats.revenue}
            gradient="from-purple-500 to-purple-700"
          />
        </div>
      )}
    </div>
  );
}

/* ====== COMPOSANT CARD ====== */
function StatCard({ title, value, gradient }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${gradient}
        shadow-lg hover:shadow-2xl
        transform hover:-translate-y-1 transition-all duration-300
      `}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10">
        <h2 className="text-sm uppercase tracking-wider text-white/80">
          {title}
        </h2>
        <p className="text-4xl font-extrabold mt-3">
          {value}
        </p>
      </div>
    </div>
  );
}
