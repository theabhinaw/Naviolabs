import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    const res = await googleLogin(credentialResponse.credential, role);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Google Sign-Up failed.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    const res = await register(name, email, password, role);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section className="auth-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingTop: '80px',
      background: 'radial-gradient(circle at top right, var(--soft) 0%, var(--bg) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'var(--teal)', opacity: '0.05', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'var(--amber)', opacity: '0.05', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      
      <div className="wrap" style={{ 
        maxWidth: '420px', 
        width: '100%', 
        position: 'relative', 
        zIndex: 1,
        background: 'color-mix(in srgb, var(--bg) 95%, transparent)',
        padding: '2.5rem',
        borderRadius: '24px',
        border: '1px solid var(--rule)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Create Account</h1>
        
        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="form-alert">{error}</div>}
          
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="field">
            <label htmlFor="role">Account Type</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--rule)', background: 'var(--bg)', color: 'var(--ink)' }}
            >
              <option value="user">User / Client</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          
          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--ink-2)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>or sign up with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-Up was unsuccessful. Try again.')}
              useOneTap
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
