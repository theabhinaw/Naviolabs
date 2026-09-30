import { useState, useEffect } from 'react';
import '../styles/loading.css';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2400;
    const interval = 30;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * 1.5;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => setFadeOut(true), 400);
        setTimeout(() => onComplete?.(), 1100);
      }
      setProgress(Math.min(Math.round(current), 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'is-done' : ''}`}>
      <div className="loading-content">
        <p className="loading-init">INITIALIZING SYSTEMS...</p>
        <h1 className="loading-brand">NAVIO LABS</h1>
        <p className="loading-sub">FULL-STACK AI AUTOMATION AGENCY</p>
        <div className="loading-counter">{progress}%</div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="loading-footer">
        <span className="loading-status">LOADING MODULES...</span>
        <span className="loading-secure">SECURE CONNECTION</span>
      </div>
    </div>
  );
}
