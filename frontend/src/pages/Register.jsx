import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError('');

    // 1. Validation Checks
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (age < 13) {
      setError('You must be at least 13 years old to register.');
      return;
    }

    try {
      // 2. Send the new data (including age) to your Node backend
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, age: Number(age), password })
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
          
          {/* Added autoComplete="off" to the form element */}
          <form className="auth-form" onSubmit={handleRegister} autoComplete="off">
            
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              autoComplete="off"
            />
            
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="off"
            />

            <input 
              type="number" 
              placeholder="Age" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              required 
              min="1"
              max="120"
              autoComplete="off"
            />
            
            {/* Using new-password forces the browser to stop auto-filling the username above it */}
            <input 
              type="password" 
              placeholder="Password (Min. 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
              autoComplete="new-password" 
            />

            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              minLength="6"
              autoComplete="new-password"
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
            
            {/* NEW: Added Logo Image here */}
            <img src="/LOGO.png" alt="CineMatch Logo" className="auth-brand-icon" />
            
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