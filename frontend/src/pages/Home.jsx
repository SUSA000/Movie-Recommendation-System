import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch trending movies from TMDB
    const fetchTrendingMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();
        
        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const saveToWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    
    // If they aren't logged in, redirect them to the login page
    if (!token) {
      alert("You must be logged in to save movies!");
      navigate('/login');
      return;
    }

    try {
      // Format the data exactly as our backend User Schema expects
      const movieData = {
        movieId: movie.id.toString(),
        title: movie.title || movie.name,
        posterPath: movie.poster_path
      };

      const response = await fetch('http://localhost:5000/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Passing the bouncer!
        },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${movie.title || movie.name} added to your Watchlist! 🍿`);
      } else {
        // This catches the "Movie is already in your watchlist!" error we wrote earlier
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
          {movies.map((movie) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;