// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Find the root div that index.html provides
const rootEl = document.getElementById('root');
if (!rootEl) {
    throw new Error("Root element #root not found. Check index.html.");
}

// Mount the React app
const root = createRoot(rootEl);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Debug breadcrumb so you can see the file actually loaded
console.log('✅ main.jsx mounted App into #root');