import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useTheme from './hooks/useTheme.js';
import { SECTIONS } from './data/content.js';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollRail from './components/layout/ScrollRail.jsx';
import WhatsAppFab from './components/layout/WhatsAppFab.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [prefill, setPrefill] = useState(null);

  const handleGetRealNumber = useCallback((values) => {
    setPrefill({ values, stamp: Date.now() });
    const target = document.getElementById('contact');
    if (target) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <Routes>
        <Route path="/" element={
          <>
            <ScrollRail sections={SECTIONS} />
            <main id="main">
              <Home handleGetRealNumber={handleGetRealNumber} prefill={prefill} />
            </main>
          </>
        } />
        
        <Route path="/login" element={<main id="main"><Login /></main>} />
        <Route path="/register" element={<main id="main"><Register /></main>} />
        <Route path="/dashboard" element={<main id="main"><Dashboard /></main>} />
      </Routes>

      <Footer />
      <WhatsAppFab />
    </>
  );
}
