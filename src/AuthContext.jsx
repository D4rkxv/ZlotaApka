import React, { useState, useContext, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "jan kowalski",
    email: "jankowalski@gmail.com",
  }); //delete if u want start on landing page!
  const [currentPage, setCurrentPage] = useState("loading");
  const isAuthenticated = !!user;

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCurrentPage("landing");
    localStorage.removeItem("token");
  };
  const switchPage = (page) => {
    setCurrentPage(page);
  };
  const goToLanding = () => setCurrentPage("landing");
  const goToLogin = () => setCurrentPage("login");
  const goToRegister = () => setCurrentPage("register");

  return (
    <AuthContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        switchPage: switchPage,
        goToLanding,
        goToLogin,
        goToRegister,
        logout,
        login,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthLayout = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthLayout musi być użyty wewnatrz AuthLayoutProvider");
  }
  return context;
};
