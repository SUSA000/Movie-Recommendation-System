import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Reusing your awesome glassmorphism styles!

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save the new token to localStorage
        localStorage.setItem('token', data.token);
        // Force a page reload to update the Navbar state, then redirect home
        window.location.href = '/'; 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to the server. Is your backend running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h2>Welcome Back</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
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
          <button type="submit">Log In</button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00d2ff' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;