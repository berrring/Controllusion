import { createContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { clearSession, ensureDatabase, getSession } from '../services/storage';
import { useContext } from 'react';
import { UIContext } from './UIContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { updateTheme } = useContext(UIContext);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getSession()?.token || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureDatabase();
    const session = getSession();

    if (!session?.token) {
      setLoading(false);
      return;
    }

    async function loadCurrentUser() {
      try {
        const currentUser = await authService.getCurrentUser();
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
  }, []);

  async function loginUser(payload) {
    const response = await authService.login(payload);
    setUser(response.user);
    setToken(response.token);
    updateTheme(response.user.themePreference || 'light');
    return response.user;
  }

  async function registerUser(payload) {
    const response = await authService.register(payload);
    setUser(response.user);
    setToken(response.token);
    updateTheme(response.user.themePreference || 'light');
    return response.user;
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
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }

  async function saveProfile(payload) {
    const updatedUser = await authService.updateProfile(payload);
    setUser(updatedUser);
    updateTheme(updatedUser.themePreference || 'light');
    return updatedUser;
  }

  async function updatePassword(payload) {
    return authService.changePassword(payload);
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
