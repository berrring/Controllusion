import { createContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import { clearSession, getSession, saveSession, SESSION_EXPIRED_EVENT } from '../services/storage';
import { useContext } from 'react';
import { UIContext } from './UIContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { updateTheme } = useContext(UIContext);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getSession()?.token || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();

    if (!session?.token) {
      setLoading(false);
      return;
    }

    async function loadCurrentUser() {
      try {
        const currentUser = await profileService.getProfile();
        setUser(currentUser);
        updateTheme(currentUser.themePreference || 'light');
      } catch (error) {
        clearSession();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentUser();
  }, [updateTheme]);

  useEffect(() => {
    function handleSessionExpired() {
      clearSession();
      setUser(null);
      setToken(null);
      updateTheme('light');
      setLoading(false);
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [updateTheme]);

  function persistSession(response) {
    if (!response?.token) {
      throw new Error('Authentication succeeded but no token was returned by the API.');
    }

    saveSession({
      token: response.token,
      refreshToken: response.refreshToken || null,
      userId: response.user?.id || null,
      createdAt: new Date().toISOString(),
    });
    setToken(response.token);
  }

  async function loginUser(payload) {
    const response = await authService.login(payload);
    persistSession(response);
    const currentUser = response.user || (await profileService.getProfile());
    setUser(currentUser);
    updateTheme(currentUser.themePreference || 'light');
    return currentUser;
  }

  async function registerUser(payload) {
    const response = await authService.register(payload);
    persistSession(response);
    const currentUser = response.user || (await profileService.getProfile());
    setUser(currentUser);
    updateTheme(currentUser.themePreference || 'light');
    return currentUser;
  }

  async function logoutUser() {
    try {
      await authService.logout();
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
      updateTheme('light');
    }
  }

  async function refreshUser() {
    const currentUser = await profileService.getProfile();
    setUser(currentUser);
    return currentUser;
  }

  async function saveProfile(payload) {
    const updatedUser = await profileService.updateProfile(payload);
    setUser(updatedUser);
    updateTheme(updatedUser.themePreference || 'light');
    return updatedUser;
  }

  async function updatePassword(payload) {
    return profileService.changePassword(payload);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        loginUser,
        registerUser,
        logoutUser,
        refreshUser,
        saveProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
