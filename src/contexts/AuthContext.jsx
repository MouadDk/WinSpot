import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pub2win_token'));
  const [isLoading, setIsLoading] = useState(true);

  // When token changes, we can save to localstorage and fetch user profile
  useEffect(() => {
    if (token) {
      localStorage.setItem('pub2win_token', token);
      // Optional: Fetch latest user profile from backend using token
      // For now, we will decode the JWT or rely on user object saved in local storage
      try {
        const storedUser = localStorage.getItem('pub2win_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no stored user, maybe token is invalid, but let's keep it simple
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem('pub2win_token');
      localStorage.removeItem('pub2win_user');
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('pub2win_user', JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
