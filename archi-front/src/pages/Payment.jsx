import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/graphql";

export default function PaymentPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const pay = async () => {
    if (!reservationId) {
      setError("❌ Réservation introuvable");
      return;
    }

    setLoading(true);
    setMsg("");
    setError("");

    try {
      const res = await api.post("", {
        query: `
          mutation Pay($reservationId: ID!) {
            payReservation(reservationId: $reservationId) {
              id
              status
              amount
            }
          }
        `,
        variables: {
          reservationId: reservationId,
        },
      });

      if (res.data.errors) {
        setError(res.data.errors[0].message);
        return;
      }

      setMsg("✅ Paiement effectué avec succès");

      setTimeout(() => {
        navigate("/my-reservations");
      }, 1200);

    } catch (err) {
      console.error(err);
      setError("❌ Paiement échoué");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">

      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl
                      border border-gray-700 rounded-3xl shadow-2xl p-8">

        <h1 className="text-2xl font-extrabold mb-6 tracking-tight">
          💳 Paiement de la réservation
        </h1>

        <p className="text-gray-400 mb-4">
          Réservation n° <span className="font-semibold text-indigo-400">#{reservationId}</span>
        </p>

        {/* ❌ ERREUR */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30
                          px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ✅ BOUTON */}
        <button
          onClick={pay}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90"
            }`}
        >
          {loading ? "Paiement en cours..." : "Payer maintenant"}
        </button>

        {/* ✅ SUCCESS */}
        {msg && (
          <p className="mt-5 text-center text-emerald-400 font-semibold">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
