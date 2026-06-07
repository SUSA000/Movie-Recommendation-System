import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();
        
        // NEW: Safety check to prevent the fatal .map() crash!
        if (data.results) {
          setMovies(data.results);
        } else {
          console.error("TMDB returned an error instead of movies:", data);
          setMovies([]); // Fallback to an empty array so it doesn't crash
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const saveToWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("You must be logged in to save movies!");
      navigate('/login');
      return;
    }

    try {
      const movieData = {
        movieId: movie.id.toString(),
        title: movie.title || movie.name,
        posterPath: movie.poster_path
      };

      // UPDATED: Now points to your live Hugging Face Node.js database!
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${movie.title || movie.name} added to your Watchlist! 🍿`);
      } else {
        alert(data.message); 
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Trending Today</h1>
      
      {loading ? (
        <p className="loading-text">Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>⭐ {movie.vote_average.toFixed(1)}</p>
                  <button 
                    className="save-btn" 
                    onClick={() => saveToWatchlist(movie)}
                  >
                    + Watchlist
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'white' }}>Failed to load trending movies. Check your TMDB API key!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;