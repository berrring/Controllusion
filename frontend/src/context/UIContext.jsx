import { createContext, useCallback, useEffect, useState } from 'react';
import { DEFAULT_NOTIFICATION_TIMEOUT } from '../utils/constants';
import { getPreferences, savePreferences } from '../services/storage';

export const UIContext = createContext(null);

function normalizeTheme() {
  return 'light';
}

export function UIProvider({ children }) {
  const [preferences, setPreferences] = useState(() => getPreferences());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    document.documentElement.dataset.theme = normalizeTheme(preferences.theme);
  }, [preferences.theme]);

  const updateTheme = useCallback((theme) => {
    const nextTheme = normalizeTheme(theme);
    setPreferences((current) => (current.theme === nextTheme ? current : { ...current, theme: nextTheme }));
  }, []);

  const showToast = useCallback(({
    title,
    description = '',
    type = 'success',
    duration = DEFAULT_NOTIFICATION_TIMEOUT,
  }) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, title, description, type };
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  return (
    <UIContext.Provider
      value={{
        preferences,
        sidebarOpen,
        setSidebarOpen,
        updateTheme,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
