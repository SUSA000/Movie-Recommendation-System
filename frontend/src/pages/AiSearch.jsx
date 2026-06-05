import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Reusing your grid styles!
import './AiSearch.css'; // We will create this for the search bar

const AiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setMovies([]);

    try {
      // 1. Send the movie name to your Python AI Server
      const aiResponse = await fetch('http://127.0.0.1:5001/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: searchTerm })
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        setError(aiData.error || 'Movie not found in our AI database. Try another one! (e.g., Avatar, The Dark Knight)');
        setLoading(false);
        return;
      }

      // 2. The AI returns IDs. Now we fetch the official posters from TMDB!
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      
      const moviePromises = aiData.map(async (movie) => {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`);
        return await tmdbRes.json();
      });

      const fullMoviesData = await Promise.all(moviePromises);
      setMovies(fullMoviesData);
      
    } catch (err) {
      console.error(err);
      setError("Cannot connect to the AI server. Is Python running?");
    } finally {
      setLoading(false);
    }
  };

  // The exact same save function so users can save AI recommendations!
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
      const response = await fetch('http://localhost:5000/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${movie.title} added to your Watchlist! 🍿`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to save movie.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="page-title">AI Matchmaker</h1>
      <p style={{ color: 'gray', marginBottom: '30px' }}>Type a movie you love, and our Machine Learning model will find 5 exact matches.</p>
      
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          className="search-input"
          placeholder="e.g. Interstellar, The Matrix, Iron Man..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">
          {loading ? 'Thinking...' : 'Discover'}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      
      {movies.length > 0 && (
        <div className="movie-grid" style={{ marginTop: '40px' }}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-actions">
                  <p>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                  <button className="save-btn" onClick={() => saveToWatchlist(movie)}>
                    + Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiSearch;