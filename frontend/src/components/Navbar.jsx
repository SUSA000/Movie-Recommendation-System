import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  // Check if the user is logged in by looking for the token
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Send them back to the login screen
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">🎬 MovieRec</Link>
      </div>

      <div className="nav-links">
        <Link
          to="/ai-search"
          className="nav-item"
          style={{ color: "#00d2ff", fontWeight: "bold" }}
        >
          ✨ AI Match
        </Link>
        {token ? (
          <>
            <Link to="/watchlist" className="nav-item">
              Watchlist
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/register" className="nav-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
