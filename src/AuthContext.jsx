import React, { useState, useContext, createContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser
    ? JSON.parse(savedUser)
    : {
        name: "Jan Kowalski",
        email: "jankowalski@gmail.com",
      };
});//delete if u want start on landing page! //  { name: "jan kowalski", email: "jankowalski@gmail.com", }
useEffect(() => {
  localStorage.setItem("user", JSON.stringify(user));
}, [user]);

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
  const setName = (newName) =>{
    setUser({name: newName, email:user.email})
  }
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
        setName
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
