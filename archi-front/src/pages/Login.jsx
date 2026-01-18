import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../auth/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const token = await login(username, password);
      localStorage.setItem("token", token);
      navigate("/events");
    } catch {
      setErr("Nom d'utilisateur ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6">

      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl p-8 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Connexion
          </h1>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
            Secure
          </span>
        </div>

        <p className="text-gray-300 mb-6">
          Accède à la plateforme et réserve tes événements.
        </p>

        {/* ERROR */}
        {err && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-300">
              Nom d'utilisateur
            </label>
            <input
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                       text-white font-semibold py-3 transition
                       hover:from-indigo-700 hover:to-purple-700
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
