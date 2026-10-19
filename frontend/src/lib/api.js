// Central place to read the backend API base URL from the environment.
// Set VITE_API_URL in frontend/.env (see root .env.example).
// Falls back to localhost:5000 for local development.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---- Session helpers -----------------------------------------------------
// The JWT + logged-in user are kept in sessionStorage under "currentSession"
// (this is just where the browser caches the active session — it is NOT
// the app's data store; issues/users always come from the backend).
//
// sessionStorage (not localStorage) is intentional: it is scoped to a single
// browser tab. localStorage is shared across every tab/window of the same
// site, so logging in as admin in one tab would silently overwrite — and
// effectively log out — a user session open in another tab. With
// sessionStorage, each tab keeps its own independent session, so you can be
// logged in as a user in one tab and as admin in another at the same time.
// (Opening a brand-new tab still requires logging in again, since a fresh
// tab has no sessionStorage of its own — that's expected.)

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("currentSession")) || null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  sessionStorage.setItem("currentSession", JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem("currentSession");
}

// Resolves a photo path returned by the backend (e.g. "/uploads/x.jpg")
// into a full URL the <img> tag can load.
export function resolvePhotoUrl(photoPath) {
  if (!photoPath) return "";
  if (photoPath.startsWith("http") || photoPath.startsWith("blob:") || photoPath.startsWith("data:")) {
    return photoPath;
  }
  return `${API_URL}${photoPath}`;
}

// ---- Fetch wrapper ---------------------------------------------------------
// Attaches the JWT (if present) and throws on non-2xx responses with the
// backend's error message.
export async function apiFetch(path, options = {}) {
  const session = getSession();
  const token = session?.token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new Error(body?.message || `Request failed: ${res.status}`);
  }
  return body;
}

// ---- Domain-specific calls --------------------------------------------------

export const authApi = {
  login: (email, password) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (payload) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => apiFetch("/api/auth/me"),
};

export const issuesApi = {
  create: (formData) => apiFetch("/api/issues", { method: "POST", body: formData }),
  mine: () => apiFetch("/api/issues/my"),
  byId: (id) => apiFetch(`/api/issues/${id}`),
  all: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/issues${qs ? `?${qs}` : ""}`);
  },
  updateStatus: (id, status) =>
    apiFetch(`/api/issues/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  remove: (id) => apiFetch(`/api/issues/${id}`, { method: "DELETE" }),
};

export const usersApi = {
  all: () => apiFetch("/api/users"),
  remove: (id) => apiFetch(`/api/users/${id}`, { method: "DELETE" }),
};

export const notificationsApi = {
  mine: () => apiFetch("/api/notifications/my"),
  markRead: () => apiFetch("/api/notifications/mark-read", { method: "PUT" }),
};
