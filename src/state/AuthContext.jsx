import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false); // <--- NEW FLAG

  useEffect(() => {
    // Load user & token once when app starts
    const rawUser = localStorage.getItem('rw_user');
    const rawToken = localStorage.getItem('rw_token');

    if (rawUser) setUser(JSON.parse(rawUser));
    if (rawToken) setToken(rawToken);
    setReady(true); // mark that initialization is done
  }, []);

  // keep storage in sync
  useEffect(() => {
    if (user) localStorage.setItem('rw_user', JSON.stringify(user));
    else localStorage.removeItem('rw_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('rw_token', token);
    else localStorage.removeItem('rw_token');
  }, [token]);

  const login = (userObj, jwt) => {
    setUser(userObj);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, setToken, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
