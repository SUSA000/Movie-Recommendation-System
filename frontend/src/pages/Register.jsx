import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError('');

    try {
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
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
            <h2>Create an Account</h2>
            <p>Join today and unlock personalized AI recommendations.</p>
          </div>

          {error && <p className="error-msg">{error}</p>}
          
          <form className="auth-form" onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password (Min. 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
            <button className="auth-btn" type="submit">SIGN UP</button>
          </form>

          <div className="auth-footer">
            Already have an account? 
            <Link to="/login" className="auth-link">Sign In</Link>
          </div>
        </div>

        {/* Right Side: Visual Branding */}
        <div className="auth-image-section">
          <div className="auth-image-overlay">
            <h1 className="brand-logo">CineMatch</h1>
            <p className="brand-tagline">
              Your personal cinema curator. Build your watchlist and explore thousands of titles seamlessly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;