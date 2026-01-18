import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/graphql";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.post("", {
      query: `
        query {
          myReservations {
            id
            numberOfTickets
            status
            event {
              title
            }
          }
        }
      `,
    })
      .then(res => {
        if (res.data.errors) {
          setError("⚠️ Accès refusé ou session expirée");
          return;
        }
        setReservations(res.data.data.myReservations);
      })
      .catch(() => {
        setError("❌ Impossible de charger vos réservations");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">

      {/* 🔙 HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Mes réservations
        </h1>

        <button
          onClick={() => navigate("/events")}
          className="px-5 py-2.5 rounded-xl bg-gray-700/60 hover:bg-gray-700 transition border border-gray-600"
        >
          ← Retour aux événements
        </button>
      </div>

      {/* ❌ ERREUR */}
      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl max-w-xl">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {reservations.length === 0 && !error && (
        <p className="text-gray-400">
          Aucune réservation trouvée
        </p>
      )}

      {/* 📦 LIST */}
      <div className="space-y-6 max-w-3xl">
        {reservations.map(r => (
          <div
            key={r.id}
            className="bg-gray-800/70 backdrop-blur border border-gray-700 rounded-2xl p-6
                       flex flex-col sm:flex-row justify-between items-start sm:items-center
                       shadow-lg hover:shadow-2xl transition"
          >
            <div>
              <h2 className="text-xl font-bold text-indigo-400">
                {r.event.title}
              </h2>

              <p className="text-gray-300 mt-1">
                🎟️ {r.numberOfTickets} tickets
              </p>

              <p
                className={`mt-1 font-semibold ${
                  r.status === "PAID"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {r.status}
              </p>
            </div>

            {r.status !== "PAID" && (
              <button
                onClick={() => navigate(`/payment/${r.id}`)}
                className="mt-4 sm:mt-0 px-6 py-2.5 rounded-xl
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           hover:opacity-90 transition font-semibold"
              >
                Payer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
