import React, { createContext, useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserSwitcher"; // Kontext pro přepínání uživatelů
import UserSwitcher from "./components/UserSwitcher"; // Přepínač uživatelů
import ShoppingListsPage from "./components/ShoppingListsPage";
import ShoppingListDetail from "./components/ShoppingListDetail";
import "./App.css";

// Kontext pro téma (Light/Dark mód)
const ThemeContext = createContext();

const App = () => {
  const [theme, setTheme] = useState("light"); // Výchozí režim

  // Funkce pro přepínání režimu
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Aplikace třídy na <body> při změně tématu
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserProvider>
        <Router>
          <header className="app-header">
            <button onClick={toggleTheme} className="theme-toggle">
              Přepnout na {theme === "light" ? "tmavý" : "světlý"} režim
            </button>
          </header>
          <Routes>
            <Route path="/" element={<Navigate to="/shopping-lists" replace />} />
            <Route path="/shopping-lists" element={<><UserSwitcher /><ShoppingListsPage /></>} />
            <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
            <Route path="*" element={<div>404: Page Not Found</div>} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); // Hook pro přístup k tématu
export default App;
