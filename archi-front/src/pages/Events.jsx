import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/graphql";
import { getUserRole, logout } from "../utils/auth";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const role = getUserRole();
  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.post("", {
        query: `
          query {
            events {
              id
              title
              description
              location
              dateTime
              price
              capacity
            }
          }
        `,
      });

      if (res.data.errors) {
        setError("❌ Impossible de charger les événements");
        return;
      }

      setEvents(res.data.data.events);
    } catch {
      setError("❌ Erreur serveur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;

    try {
      await api.post("", {
        query: `
          mutation Delete($id: ID!) {
            deleteEvent(id: $id)
          }
        `,
        variables: { id },
      });

      setEvents(events.filter(e => e.id !== id));
    } catch {
      alert("❌ Suppression échouée");
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Voulez-vous vous déconnecter ?")) return;
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">

      {/* 🔝 HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Événements disponibles
        </h1>

        <div className="flex flex-wrap gap-4">
          {isUser && (
            <>
              <button
                onClick={() => navigate("/my-reservations")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
              >
                Mes réservations
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 transition font-semibold"
              >
                Notifications
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate("/admin/events")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition font-semibold"
            >
              Gérer les événements
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* ❌ ERREUR */}
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl max-w-xl">
          {error}
        </div>
      )}

      {/* 📦 EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map(e => (
          <div
            key={e.id}
            className="relative bg-gray-800/70 backdrop-blur border border-gray-700 rounded-2xl p-6
                       shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                       flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-indigo-400">
                {e.title}
              </h2>

              <p className="text-gray-300 mt-3 line-clamp-3">
                {e.description}
              </p>

              <div className="mt-5 text-sm text-gray-400 space-y-1">
                <p>📍 {e.location}</p>
                <p>🕒 {e.dateTime.replace("T", " ")}</p>
                <p>
                  🎟️{" "}
                  <span
                    className={`font-semibold ${
                      e.capacity === 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {e.capacity} places
                  </span>
                </p>
                <p>💰 {e.price} MAD</p>
              </div>
            </div>

            {/* 🔘 ACTIONS */}
            {isAdmin ? (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate(`/admin/events?edit=${e.id}`)}
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 transition py-2 font-semibold"
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(e.id)}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 transition py-2 font-semibold"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <button
                disabled={e.capacity === 0}
                onClick={() => navigate(`/reserve/${e.id}`)}
                className={`mt-6 py-2.5 rounded-xl font-semibold transition
                  ${
                    e.capacity === 0
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                  }`}
              >
                {e.capacity === 0 ? "Complet" : "Réserver"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
