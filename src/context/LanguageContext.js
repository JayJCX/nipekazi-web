"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences
    const savedLang = localStorage.getItem("nipekazi_lang");
    if (savedLang === "en" || savedLang === "sw") {
      setLanguage(savedLang);
    }

    const savedTheme = localStorage.getItem("nipekazi_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.body.classList.add("light-mode");
      } else {
        document.body.classList.remove("light-mode");
      }
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("nipekazi_lang", lang);
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("nipekazi_theme", newTheme);
    if (newTheme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  };

  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      return translations["en"][key] || key;
    }
    return translations[language][key];
  };

  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, theme, toggleTheme, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
