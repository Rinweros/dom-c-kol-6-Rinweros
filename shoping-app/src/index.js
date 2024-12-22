import React from 'react';
import ReactDOM from 'react-dom/client'; // Použití nové API React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; // Načtení nastavení pro překlady

// Vytvoření rootu pomocí nové API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Volitelné: měření výkonu aplikace
reportWebVitals();
