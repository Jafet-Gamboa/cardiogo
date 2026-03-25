import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/Autentication";
import { RolContext } from "./RolContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setRol } = useContext(RolContext);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUsuario({ id: userId });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    setUsuario({ id: response.data.user_id });
    setRol(response.data.rol_id);
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
