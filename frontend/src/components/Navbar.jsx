import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import aiAnimation from './ai-animation.json';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Brand Logo & Text */}
      <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
        <img 
          src="/LOGO.png" 
          alt="CineMatch Logo" 
          className="brand-image" 
        />
        <div className="brand-text">
          <span className="logo-white">Cine</span><span className="logo-red">Match</span>
        </div>
      </Link>

      {/* Hamburger Icon (Only visible on mobile) */}
      <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? (
          <span className="close-icon">✖</span>
        ) : (
          <span className="hamburger-icon">☰</span>
        )}
      </div>

      {/* Navigation Links */}
      <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        
        <Link to="/ai-match" className="nav-link ai-nav-link" onClick={closeMobileMenu}>
          <div className="lottie-icon">
            <Player
              autoplay
              loop
              src={aiAnimation}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <span>CineAI</span>
        </Link>
        
        {token ? (
          <>
            <Link to="/watchlist" className="nav-link" onClick={closeMobileMenu}>Watchlist</Link>
            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
            <Link to="/register" className="nav-btn signup-btn" onClick={closeMobileMenu}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;