import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('pub2win-auth');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  }, []);

  const login = ({ role, name, email }) => {
    const authUser = {
      role,
      name: name || email?.split('@')[0] || 'Utilisateur',
      email,
    };
    window.localStorage.setItem('pub2win-auth', JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    window.localStorage.removeItem('pub2win-auth');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
