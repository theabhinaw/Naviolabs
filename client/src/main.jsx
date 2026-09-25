import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/workflow.css';
import './styles/sections.css';
import './styles/services.css';
import './styles/playground.css';
import './styles/simulator.css';
import './styles/calculator.css';
import './styles/process.css';
import './styles/team.css';
import './styles/faq.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/rail.css';
import './styles/responsive.css'; // keep last

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
