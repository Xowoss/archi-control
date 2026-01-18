import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/graphql";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.post("", {
      query: `
        query {
          myNotifications {
            id
            message
            type
            seen
            createdAt
          }
        }
      `,
    })
      .then(res => {
        if (res.data.errors) {
          setError("⚠️ Impossible de charger les notifications");
          return;
        }
        setNotifications(res.data.data.myNotifications);
      })
      .catch(() => {
        setError("❌ Erreur serveur");
      });
  }, []);

  const markAsSeen = async (id) => {
    await api.post("", {
      query: `
        mutation MarkSeen($id: ID!) {
          markNotificationAsSeen(id: $id)
        }
      `,
      variables: { id },
    });

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, seen: true } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">

      {/* 🔙 HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Mes notifications
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
      {notifications.length === 0 && !error && (
        <p className="text-gray-400">
          Aucune notification
        </p>
      )}

      {/* 🔔 LIST */}
      <div className="space-y-4 max-w-3xl">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center
                        border shadow-lg transition
              ${
                n.seen
                  ? "bg-gray-800/70 border-gray-700"
                  : "bg-indigo-500/10 border-indigo-500/40"
              }`}
          >
            <div>
              <p className="font-semibold text-gray-100">
                {n.message}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            {!n.seen && (
              <button
                onClick={() => markAsSeen(n.id)}
                className="mt-3 sm:mt-0 px-5 py-2 rounded-xl
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           hover:opacity-90 transition font-semibold"
              >
                Marquer comme vu
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
