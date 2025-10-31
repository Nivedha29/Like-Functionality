import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("rw_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("rw_token"));

  useEffect(() => {
    if (user) localStorage.setItem("rw_user", JSON.stringify(user));
    else localStorage.removeItem("rw_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("rw_token", token);
    else localStorage.removeItem("rw_token");
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
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}