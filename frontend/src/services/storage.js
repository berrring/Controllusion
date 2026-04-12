const SESSION_KEY = 'controllusion_session_v1';
const PREFERENCES_KEY = 'controllusion_preferences_v1';
const ACTIVITY_KEY = 'controllusion_activity_v1';
const NOTIFICATIONS_KEY = 'controllusion_notifications_v1';

export const NOTIFICATIONS_UPDATED_EVENT = 'controllusion:notifications-updated';
export const ACTIVITY_UPDATED_EVENT = 'controllusion:activity-updated';
export const SESSION_EXPIRED_EVENT = 'controllusion:session-expired';

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function dispatchStorageEvent(eventName, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

function normalizeNotification(item) {
  return {
    id: item.id || generateId('ntf'),
    title: item.title || 'Notification',
    message: item.message || '',
    createdAt: item.createdAt || new Date().toISOString(),
    path: item.path || null,
    read: Boolean(item.read),
  };
}

function getDefaultNotifications() {
  return [
    normalizeNotification({
      id: 'ntf_welcome',
      title: 'Welcome to Controllusion',
      message: 'Your CRM workspace is ready. Start by reviewing the dashboard or adding your first customer.',
      createdAt: new Date().toISOString(),
      path: '/dashboard',
      read: false,
    }),
  ];
}

function getStoredNotifications() {
  const notifications = safeParse(localStorage.getItem(NOTIFICATIONS_KEY), null);

  if (!Array.isArray(notifications) || !notifications.length) {
    return getDefaultNotifications();
  }

  return notifications.map(normalizeNotification);
}

function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.map(normalizeNotification)));
  dispatchStorageEvent(NOTIFICATIONS_UPDATED_EVENT);
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

export function getNotifications() {
  return getStoredNotifications();
}

export function getUnreadNotifications() {
  return getStoredNotifications().filter((item) => !item.read);
}

export function addNotification({ title, message, path = null }) {
  const notification = normalizeNotification({
    id: generateId('ntf'),
    title,
    message,
    path,
    createdAt: new Date().toISOString(),
    read: false,
  });

  const nextNotifications = [notification, ...getStoredNotifications()].slice(0, 50);
  saveNotifications(nextNotifications);
  return notification;
}

export function markNotificationRead(notificationId) {
  const nextNotifications = getStoredNotifications().map((item) =>
    item.id === notificationId ? { ...item, read: true } : item,
  );
  saveNotifications(nextNotifications);
  return nextNotifications;
}

export function markAllNotificationsRead() {
  const nextNotifications = getStoredNotifications().map((item) => ({
    ...item,
    read: true,
  }));
  saveNotifications(nextNotifications);
  return nextNotifications;
}

export function getActivityLog() {
  return safeParse(localStorage.getItem(ACTIVITY_KEY), []);
}

export function saveActivityLog(entries) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries));
  dispatchStorageEvent(ACTIVITY_UPDATED_EVENT);
  return entries;
}

export function addActivityEntry({ title, description }) {
  const entry = {
    id: generateId('act'),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  const entries = [entry, ...getActivityLog()].slice(0, 40);
  saveActivityLog(entries);
  return entry;
}

export { ACTIVITY_KEY, NOTIFICATIONS_KEY, PREFERENCES_KEY, SESSION_KEY };
