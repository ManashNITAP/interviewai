import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.data.user);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (creds) => {
    const { data } = await authApi.login(creds);
    setUser(data.data.user);
  };
  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    setUser(data.data.user);
  };
  const logout = async () => {
    try { await authApi.logout(); } finally { setUser(null); }
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refreshUser: bootstrap }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
