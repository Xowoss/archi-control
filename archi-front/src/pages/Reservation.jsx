import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/graphql";

export default function Reservation() {
  const { eventId } = useParams(); // ✅ CORRECTION ICI
  const navigate = useNavigate();

  const [tickets, setTickets] = useState(1);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reserve = async () => {
    if (!eventId) {
      setError("❌ Identifiant de l’événement introuvable");
      return;
    }

    if (tickets < 1 || tickets > 4) {
      setError("⚠️ Maximum 4 tickets autorisés");
      return;
    }

    setLoading(true);
    setMsg("");
    setError("");

    try {
      const res = await api.post("", {
        query: `
          mutation Reserve($eventId: ID!, $tickets: Int!) {
            reserveEvent(eventId: $eventId, tickets: $tickets) {
              id
              numberOfTickets
              status
            }
          }
        `,
        variables: {
          eventId: eventId,          // ✅ MAINTENANT VALIDE
          tickets: Number(tickets),
        },
      });

      if (res.data.errors) {
        setError(`❌ ${res.data.errors[0].message}`);
        return;
      }

      setMsg("✅ Réservation réussie");

      // optionnel : redirection
      setTimeout(() => {
        navigate("/my-reservations");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("❌ Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4">
          🎟️ Réserver l’événement #{eventId}
        </h1>

        <input
          type="number"
          min="1"
          max="4"
          value={tickets}
          onChange={(e) => setTickets(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <p className="text-xs text-gray-500 mb-2">
          Maximum autorisé : 4 tickets
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-3 font-medium">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          onClick={reserve}
          className={`w-full py-2 rounded-xl text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Réservation..." : "Confirmer"}
        </button>

        {msg && (
          <p className="mt-4 text-center text-green-600 text-sm font-semibold">
            {msg}
          </p>
        )}

      </div>
    </div>
  );
}
