import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // sécurité supplémentaire
    return decoded?.role || null;
  } catch (error) {
    console.error("JWT invalide ou expiré", error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
}
