import { seedCustomers, seedNotifications, seedTasks, seedUsers } from '../utils/mockData';

const DB_KEY = 'controllusion_db_v1';
const SESSION_KEY = 'controllusion_session_v1';
const PREFERENCES_KEY = 'controllusion_preferences_v1';

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function ensureDatabase() {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    const payload = {
      users: seedUsers,
      customers: seedCustomers,
      tasks: seedTasks,
      notifications: seedNotifications,
    };

    localStorage.setItem(DB_KEY, JSON.stringify(payload));
  }
}

export function getDatabase() {
  ensureDatabase();
  return safeParse(localStorage.getItem(DB_KEY), {
    users: [],
    customers: [],
    tasks: [],
    notifications: [],
  });
}

export function saveDatabase(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  return data;
}

export function getSession() {
  return safeParse(localStorage.getItem(SESSION_KEY), null);
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getPreferences() {
  return safeParse(localStorage.getItem(PREFERENCES_KEY), {
    theme: 'light',
  });
}

export function savePreferences(preferences) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  return preferences;
}

export { DB_KEY, SESSION_KEY, PREFERENCES_KEY };
