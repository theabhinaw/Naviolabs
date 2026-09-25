import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Google Login failed.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
      <div className="wrap" style={{ maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h1>
        
        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="form-alert">{error}</div>}
          
          <div className="field">
            <label htmlFor="email">Email address or Username</label>
            <input 
              id="email" 
              type="text" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="field">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          
          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--ink-2)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In was unsuccessful. Try again.')}
              useOneTap
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Sign up</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
