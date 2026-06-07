import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // We are reusing your awesome grid styles!

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      
      // If no token is found, kick them back to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://susa000-movie-node-backend.hf.space/api/auth/watchlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Passing the VIP wristband!
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // If the list is empty, our map function later will just render nothing, which is fine!
          setMovies(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [navigate]);

  return (
    <div className="home-container">
      <h1 className="page-title">My Watchlist</h1>
      
      {error && <p className="error-msg">{error}</p>}
      
      {loading ? (
        <p className="loading-text">Loading your movies...</p>
      ) : movies.length === 0 ? (
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