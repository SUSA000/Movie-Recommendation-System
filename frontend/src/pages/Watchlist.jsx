import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      
      // If no token is found, redirect to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Corrected URL: fetching from user routes instead of auth routes!
        const response = await fetch('https://susa000-movie-node-backend.hf.space/api/user/watchlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMovies(data);
        } else {
          // Capturing specific backend error messages
          setError(`Server Error: ${data.message || 'Unable to fetch watchlist'}`);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        // Surfacing the exact catch error to the UI
        setError(`Connection Error: ${err.message}. Check your internet or backend status.`);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [navigate]);

  return (
    <div className="home-container">
      <h1 className="page-title">My Watchlist</h1>
      
      {/* Enhanced error display for debugging */}
      {error && (
        <div style={{ backgroundColor: '#ff4c4c', color: 'white', padding: '15px', borderRadius: '8px', margin: '20px auto', maxWidth: '90%' }}>
          <p className="error-msg" style={{ margin: 0 }}>{error}</p>
        </div>
      )}
      
      {loading ? (
        <p className="loading-text">Loading your movies...</p>
      ) : movies.length === 0 && !error ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2 style={{ color: 'white' }}>Your watchlist is empty!</h2>
          <p style={{ color: '#00d2ff', marginTop: '10px' }}>Go to the Home page to add some movies.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.movieId} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;