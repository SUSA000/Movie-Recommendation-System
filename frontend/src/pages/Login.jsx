import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/'; 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to the server. Is your backend running?');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        {/* Left Side: Form */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to discover your next favorite movie.</p>
          </div>

          {error && <p className="error-msg">{error}</p>}
          
          <form className="auth-form" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button className="auth-btn" type="submit">SIGN IN</button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? 
            <Link to="/register" className="auth-link">Sign Up Now</Link>
          </div>
        </div>

        {/* Right Side: Visual Branding */}
        <div className="auth-image-section">
          <div className="auth-image-overlay">
            
            {/* NEW: Added Logo Image here */}
            <img src="/LOGO.png" alt="CineMatch Logo" className="auth-brand-icon" />
            
            <h1 className="brand-logo">CineMatch</h1>
            <p className="brand-tagline">
              Experience the power of Machine Learning. Let our AI find the perfect movies tailored exactly to your taste.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;