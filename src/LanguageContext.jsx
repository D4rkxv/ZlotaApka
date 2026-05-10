import React, { createContext, useContext, useState, useCallback } from "react";
import en from "./locales/en.js";
import pl from "./locales/pl.js";

const dictionaries = { en, pl };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("appLanguage") || "en"
  );

  const setLanguage = useCallback((code) => {
    if (!dictionaries[code]) return;
    localStorage.setItem("appLanguage", code);
    setLanguageState(code);
  }, []);

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
