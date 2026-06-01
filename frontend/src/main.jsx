import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#111118',
          color: '#f0f0f8',
          border: '1px solid #2a2a3a',
          borderRadius: '10px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#22c984', secondary: '#111118' } },
        error: { iconTheme: { primary: '#ff5b5b', secondary: '#111118' } },
      }}
    />
  </React.StrictMode>
);
