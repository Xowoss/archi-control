import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/graphql";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    dateTime: "",
    capacity: "",
    price: "",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");

  /* ================= LOAD EVENTS ================= */
  const loadEvents = () => {
    api.post("", {
      query: `
        query {
          events {
            id
            title
          }
        }
      `,
    }).then((res) => setEvents(res.data.data.events));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ================= LOAD EVENT TO EDIT ================= */
  useEffect(() => {
    if (editId) {
      api.post("", {
        query: `
          query {
            eventById(id: ${editId}) {
              title
              description
              location
              dateTime
              capacity
              price
            }
          }
        `,
      }).then((res) => {
        const e = res.data.data.eventById;
        setForm({
          ...e,
          dateTime: e.dateTime.slice(0, 16),
        });
      });
    }
  }, [editId]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.title.trim()) return "❌ Le titre est obligatoire";
    if (!form.dateTime) return "❌ La date est obligatoire";
    if (form.capacity <= 0) return "❌ Capacité invalide";
    if (form.price < 0) return "❌ Prix invalide";
    return "";
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const mutation = editId
      ? `
        mutation {
          updateEvent(
            id: ${editId}
            title: "${form.title}"
            description: "${form.description}"
            location: "${form.location}"
            dateTime: "${form.dateTime}"
            capacity: ${form.capacity}
            price: ${form.price}
          ) { id }
        }
      `
      : `
        mutation {
          createEvent(
            title: "${form.title}"
            description: "${form.description}"
            location: "${form.location}"
            dateTime: "${form.dateTime}"
            capacity: ${form.capacity}
            price: ${form.price}
          ) { id }
        }
      `;

    try {
      await api.post("", { query: mutation });
      setForm({
        title: "",
        description: "",
        location: "",
        dateTime: "",
        capacity: "",
        price: "",
      });
      navigate("/admin/events");
      loadEvents();
    } catch {
      setError("❌ Erreur serveur – vérifie les champs");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    await api.post("", {
      query: `mutation { deleteEvent(id: ${id}) }`,
    });
    loadEvents();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-5 py-2.5 rounded-xl bg-gray-700/60 hover:bg-gray-700 transition border border-gray-600"
        >
          ← Dashboard
        </button>

        <button
          onClick={() => navigate("/events")}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
        >
          Voir les événements
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">
        Gestion des événements
      </h1>

      {/* FORM */}
      <div className="bg-gray-800/70 backdrop-blur border border-gray-700 p-6 rounded-2xl shadow-lg mb-10 max-w-xl space-y-4">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {[
          { placeholder: "Titre", key: "title" },
          { placeholder: "Description", key: "description" },
          { placeholder: "Lieu", key: "location" },
        ].map((f) => (
          <input
            key={f.key}
            placeholder={f.placeholder}
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}

        <input
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="1"
            placeholder="Capacité"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
            className="bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-lg"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Prix"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-lg"
          />
        </div>

        <button
          onClick={submit}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 transition py-3 rounded-xl font-semibold text-lg"
        >
          {editId ? "Mettre à jour" : "Ajouter l’événement"}
        </button>
      </div>

      {/* LIST */}
      <ul className="max-w-xl space-y-3">
        {events.map((e) => (
          <li
            key={e.id}
            className="bg-gray-800/70 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:bg-gray-800 transition"
          >
            <span className="font-medium">{e.title}</span>

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => navigate(`/admin/events?edit=${e.id}`)}
                className="text-blue-400 hover:text-blue-300"
              >
                Modifier
              </button>
              <button
                onClick={() => remove(e.id)}
                className="text-red-400 hover:text-red-300"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
