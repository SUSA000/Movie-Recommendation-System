import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // FIXED SYNTAX HERE:
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save the JWT token to the browser's local storage
        localStorage.setItem('token', data.token);
        // Force a page reload to update the Navbar state, then redirect home
        window.location.href = '/';
      } else {
        // Display the error message from your backend
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to the server. Is your backend running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h2>Create an Account</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
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
            minLength="6"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;