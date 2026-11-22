// In production the client calls the Render API directly.
// For local development, create client/.env.local with:  VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'https://todo-taskmanager-diel.onrender.com';

const TOKEN_KEY = 'tm_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable: user just has to log in again next visit */
  }
};

// App registers a callback so any 401 sends the user back to the login screen
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // A 401 on a protected route means the token is missing/expired.
    // (Login failures also return 401, but there is no token yet, so skip the redirect.)
    if (res.status === 401 && token) onUnauthorized();
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

// Auth
export const signup = (email, password) =>
  request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });

export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getMe = () => request('/api/auth/me');

// Tasks
export const getTasks = () => request('/api/tasks');

export const createTask = (task) =>
  request('/api/tasks', { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id, changes) =>
  request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(changes) });

export const deleteTask = (id) => request(`/api/tasks/${id}`, { method: 'DELETE' });
