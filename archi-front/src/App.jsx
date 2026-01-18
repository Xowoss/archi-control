import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages publiques
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Pages utilisateur
import Events from "./pages/Events";
import Reservation from "./pages/Reservation";
import PaymentPage from "./pages/Payment";
import MyReservations from "./pages/MyReservations";

// Pages admin
import AdminEvents from "./pages/AdminEvents";
import Notifications from "./pages/Notifications";

// Protection routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*  Redirection par défaut */}
        <Route path="/" element={<Navigate to="/events" replace />} />

        {/*  PUBLIC */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/*  USER */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reserve/:eventId"
          element={
            <ProtectedRoute>
              <Reservation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:reservationId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />

        {/*  ADMIN ONLY */}
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 fallback (optionnel mais pro) */}
        <Route path="*" element={<Navigate to="/events" replace />} />
        <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}
