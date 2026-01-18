import { Link, useNavigate } from "react-router-dom";
import { getUserRole, logout } from "../utils/auth";

export default function Navbar() {
  const role = getUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/events">Events</Link>

        {role === "ADMIN" && (
          <Link to="/admin/events">Admin</Link>
        )}

        <Link to="/my-reservations">Mes réservations</Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded-lg"
      >
        Logout
      </button>
    </nav>
  );
}
