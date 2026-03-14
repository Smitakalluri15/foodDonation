import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    const savedUser  = localStorage.getItem('fw_user');
    const savedToken = localStorage.getItem('fw_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('fw_user',  JSON.stringify(userData));
    localStorage.setItem('fw_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fw_user');
    localStorage.removeItem('fw_token');
  };

  const isAuthenticated = () => !!token;

  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
