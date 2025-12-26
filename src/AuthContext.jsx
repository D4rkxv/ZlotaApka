import React, { useState, useContext, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("landing");
  const swtichPage = (page) => {
    setCurrentPage(page);
  };
  const goToLanding = () => setCurrentPage("landing");
  const goToLogin = () => setCurrentPage("login");
  const goToRegister = () => setCurrentPage("register");

  return (
    <AuthContext.Provider
      value={{
        currentPage,
        swtichPage,
        goToLanding,
        goToLogin,
        goToRegister,
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
