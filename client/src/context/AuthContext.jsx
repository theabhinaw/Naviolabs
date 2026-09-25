import { createContext, useState, useEffect, useContext } from 'react';

const env = import.meta.env ?? {};
const API_URL = String(env.VITE_API_URL || '').replace(/\/$/, '');

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Network error. Cannot reach server.' };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, message: 'Network error. Cannot reach server.' };
    }
  };

  const googleLogin = async (credential, role = 'user') => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Google login failed.' };
    } catch (err) {
      console.error('Google login error:', err);
      return { success: false, message: 'Network error. Cannot reach server.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
