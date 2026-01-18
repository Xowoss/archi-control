import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../auth/authService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (password.length < 6) {
      setErr("❌ Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      if (error.message === "USERNAME_ALREADY_EXISTS") {
        setErr("❌ Nom d'utilisateur déjà utilisé");
      } else if (error.message === "EMAIL_ALREADY_EXISTS") {
        setErr("❌ Email déjà utilisé");
      } else {
        setErr("❌ Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6 text-white">

      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl
                      border border-gray-700 rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-extrabold tracking-tight mb-6">
          Inscription
        </h1>

        {err && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30
                          px-4 py-2 text-sm text-red-400">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full rounded-xl bg-gray-900 border border-gray-700
                       px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            className="w-full rounded-xl bg-gray-900 border border-gray-700
                       px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full rounded-xl bg-gray-900 border border-gray-700
                       px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Mot de passe (min 6 caractères)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className={`w-full rounded-xl font-semibold py-3 transition
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
              }`}
          >
            {loading ? "Création..." : "Créer un compte"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
