import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player'; // Using the official, stable package
import aiAnimation from './ai-animation.json';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  // Check if user is logged in
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to login and force state update
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      {/* Brand Logo & Text Together */}
      <Link to="/" className="navbar-logo">
        <img 
          src="/LOGO.png" 
          alt="CineMatch Logo" 
          className="brand-image" 
        />
        <div className="brand-text">
          <span className="logo-white">Cine</span><span className="logo-red">Match</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        
        {/* NEW MODERN LOTTIE BUTTON */}
        <Link to="/ai-match" className="nav-link ai-nav-link">
          <div className="lottie-icon">
            {/* The Official Player Component */}
            <Player
              autoplay
              loop
              src={aiAnimation}
              style={{ height: '60px', width: '60px' }}
            />
          </div>
          <span>CineAI</span>
        </Link>
        
        {/* Conditional Rendering based on Authentication */}
        {token ? (
          <>
            <Link to="/watchlist" className="nav-link">Watchlist</Link>
            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;