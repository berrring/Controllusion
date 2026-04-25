const SESSION_KEY = 'controllusion_session_v1';
const PREFERENCES_KEY = 'controllusion_preferences_v1';
const ACTIVITY_KEY = 'controllusion_activity_v1';
const NOTIFICATIONS_KEY = 'controllusion_notifications_v1';
const WORKSPACE_SETTINGS_KEY = 'controllusion_workspace_settings_v1';
const DEMO_USER_IDS = new Set([
  '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
  'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
]);

export const NOTIFICATIONS_UPDATED_EVENT = 'controllusion:notifications-updated';
export const ACTIVITY_UPDATED_EVENT = 'controllusion:activity-updated';
export const WORKSPACE_SETTINGS_UPDATED_EVENT = 'controllusion:workspace-settings-updated';
export const SESSION_EXPIRED_EVENT = 'controllusion:session-expired';

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function getScopedStorageKey(baseKey) {
  const session = getSession();
  const scope = session?.userId || 'guest';
  return `${baseKey}:${scope}`;
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

function isDemoWorkspace() {
  return DEMO_USER_IDS.has(getSession()?.userId);
}

function slugify(value, fallback = 'workspace') {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
}

function buildWorkspaceId(userId) {
  const stableId = String(userId || 'guest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'guest';
  return `wrk_${stableId}`;
}

function getDefaultWorkspaceSettings() {
  const userId = getSession()?.userId;

  if (userId === '36f7c225-5cf0-4f12-84ad-bd6c936f4f01') {
    return {
      workspaceId: 'wrk_acme_982bNqLp',
      workspaceName: 'Acme Corporation',
      workspaceUrl: 'acme',
      description: 'Global leaders in avant technology.',
      adminEmail: 'admin@acme.corp',
      supportEmail: 'help@acme.corp',
      brandColor: '#0052CC',
      requireSso: true,
      logoName: 'acme-mark.svg',
      logoDataUrl: '',
      deletionRequestedAt: null,
      deletionStatus: '',
      updatedAt: new Date().toISOString(),
    };
  }

  if (userId === 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501') {
    return {
      workspaceId: 'wrk_showcase_7HdQ4P',
      workspaceName: 'Northstar Revenue Workspace',
      workspaceUrl: 'northstar-revenue',
      description: 'Demo-ready CRM workspace for revenue operations, pipeline review, and customer success.',
      adminEmail: 'showcase@controllusion.com',
      supportEmail: 'support@northstarcommerce.com',
      brandColor: '#0052CC',
      requireSso: true,
      logoName: 'northstar-logo.svg',
      logoDataUrl: '',
      deletionRequestedAt: null,
      deletionStatus: '',
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    workspaceId: buildWorkspaceId(userId),
    workspaceName: 'New Workspace',
    workspaceUrl: 'new-workspace',
    description: '',
    adminEmail: '',
    supportEmail: '',
    brandColor: '#4c42e8',
    requireSso: false,
    logoName: '',
    logoDataUrl: '',
    deletionRequestedAt: null,
    deletionStatus: '',
    updatedAt: new Date().toISOString(),
  };
}

function normalizeWorkspaceSettings(settings) {
  const defaults = getDefaultWorkspaceSettings();
  return {
    ...defaults,
    ...settings,
    workspaceId: settings?.workspaceId || defaults.workspaceId,
    workspaceName: String(settings?.workspaceName || defaults.workspaceName).trim(),
    workspaceUrl: slugify(settings?.workspaceUrl || defaults.workspaceUrl),
    description: String(settings?.description ?? defaults.description),
    adminEmail: String(settings?.adminEmail ?? defaults.adminEmail),
    supportEmail: String(settings?.supportEmail ?? defaults.supportEmail),
    brandColor: /^#[0-9a-fA-F]{6}$/.test(settings?.brandColor || '') ? settings.brandColor : defaults.brandColor,
    requireSso: typeof settings?.requireSso === 'boolean' ? settings.requireSso : defaults.requireSso,
    logoName: String(settings?.logoName ?? defaults.logoName),
    logoDataUrl: String(settings?.logoDataUrl ?? defaults.logoDataUrl),
    deletionRequestedAt: settings?.deletionRequestedAt ?? defaults.deletionRequestedAt,
    deletionStatus: settings?.deletionStatus ?? defaults.deletionStatus,
    updatedAt: settings?.updatedAt || defaults.updatedAt,
  };
}

function getDefaultNotifications() {
  if (isDemoWorkspace()) {
    return [
      normalizeNotification({
        id: 'ntf_demo_deal',
        title: 'Deal review due',
        message: 'Northstar Commerce has a renewal checkpoint scheduled for this week.',
        createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        path: '/customers/a621bdd0-4d50-4f4a-a832-91bf98ba4701',
        read: false,
      }),
      normalizeNotification({
        id: 'ntf_demo_lead',
        title: 'New inbound lead assigned',
        message: 'Theo Park from Summit Grid entered the lead queue.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        path: '/leads',
        read: false,
      }),
      normalizeNotification({
        id: 'ntf_demo_support',
        title: 'Support SLA healthy',
        message: 'All priority tickets are within response targets.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        path: '/support',
        read: true,
      }),
      normalizeNotification({
        id: 'ntf_demo_report',
        title: 'Weekly report ready',
        message: 'Revenue forecast and pipeline velocity are ready to export.',
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        path: '/analytics',
        read: true,
      }),
    ];
  }

  return [
    normalizeNotification({
      id: 'ntf_welcome',
      title: 'Welcome to Controllusion',
      message: 'Your clean workspace is ready. Add your first account when you are ready.',
      createdAt: new Date().toISOString(),
      path: '/dashboard',
      read: false,
    }),
  ];
}

function getStoredNotifications() {
  const notifications = safeParse(localStorage.getItem(getScopedStorageKey(NOTIFICATIONS_KEY)), null);

  if (!Array.isArray(notifications) || !notifications.length) {
    return getDefaultNotifications();
  }

  const normalizedNotifications = notifications.map(normalizeNotification);
  if (!isDemoWorkspace()) {
    return normalizedNotifications;
  }

  const existingIds = new Set(normalizedNotifications.map((item) => item.id));
  return [
    ...normalizedNotifications,
    ...getDefaultNotifications().filter((item) => !existingIds.has(item.id)),
  ];
}

function saveNotifications(notifications) {
  localStorage.setItem(
    getScopedStorageKey(NOTIFICATIONS_KEY),
    JSON.stringify(notifications.map(normalizeNotification)),
  );
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
  return safeParse(localStorage.getItem(getScopedStorageKey(PREFERENCES_KEY)), {
    theme: 'light',
  });
}

export function savePreferences(preferences) {
  localStorage.setItem(getScopedStorageKey(PREFERENCES_KEY), JSON.stringify(preferences));
  return preferences;
}

export function getWorkspaceSettings() {
  const stored = safeParse(localStorage.getItem(getScopedStorageKey(WORKSPACE_SETTINGS_KEY)), null);
  return normalizeWorkspaceSettings(stored);
}

export function saveWorkspaceSettings(settings) {
  const nextSettings = normalizeWorkspaceSettings({
    ...settings,
    updatedAt: new Date().toISOString(),
  });
  localStorage.setItem(getScopedStorageKey(WORKSPACE_SETTINGS_KEY), JSON.stringify(nextSettings));
  dispatchStorageEvent(WORKSPACE_SETTINGS_UPDATED_EVENT, nextSettings);
  return nextSettings;
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

function getDefaultActivityLog() {
  if (!isDemoWorkspace()) {
    return [];
  }

  return [
    {
      id: 'act_demo_closed',
      title: 'Deal Closed: Acme Corp Enterprise Expansion',
      description: 'Sarah Jenkins successfully closed the Q3 expansion deal. Contract signed and onboarding initiated.',
      createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    },
    {
      id: 'act_demo_sync',
      title: 'Strategic Sync: Globex Account',
      description: 'Initial discovery call completed. Client is evaluating cloud infrastructure solutions for Q4 implementation.',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'act_demo_lead',
      title: 'New Inbound Lead: TechFlow Inc.',
      description: 'Lead generated from Enterprise Automation 2024 whitepaper download.',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getActivityLog() {
  const stored = localStorage.getItem(getScopedStorageKey(ACTIVITY_KEY));
  if (stored === null) {
    return getDefaultActivityLog();
  }

  const entries = safeParse(stored, []);
  if (!isDemoWorkspace()) {
    return entries;
  }

  const existingIds = new Set(entries.map((item) => item.id));
  return [
    ...entries,
    ...getDefaultActivityLog().filter((item) => !existingIds.has(item.id)),
  ];
}

export function saveActivityLog(entries) {
  localStorage.setItem(getScopedStorageKey(ACTIVITY_KEY), JSON.stringify(entries));
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

export { ACTIVITY_KEY, NOTIFICATIONS_KEY, PREFERENCES_KEY, SESSION_KEY, WORKSPACE_SETTINGS_KEY };
