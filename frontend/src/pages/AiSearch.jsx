import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import './AiSearch.css'; 

// --- NEW: Your Live Hugging Face AI URL ---
const AI_API_BASE_URL = "https://susa000-movie-ai-backend.hf.space";

const AiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]); // AI recommended movies
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Autocomplete State
  const [allMovieTitles, setAllMovieTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Fetch all 5,000 movie titles when the page first loads
  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        // UPDATED: Now fetches from your live cloud AI
        const response = await fetch(`${AI_API_BASE_URL}/api/movies`);
        const data = await response.json();
        setAllMovieTitles(data);
      } catch (err) {
        console.error("Could not load movie titles for autocomplete.", err);
      }
    };
    fetchMovieTitles();
  }, []);

  // 2. Hide dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Handle what happens when the user types in the box
  const handleTyping = (e) => {
    const userInput = e.target.value;
    setSearchTerm(userInput);

    if (userInput.length > 0) {
      const matches = allMovieTitles.filter(title => 
        title.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredTitles(matches.slice(0, 8)); 
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // 4. Handle what happens when they click a movie from the dropdown
  const handleSelectMovie = (title) => {
    setSearchTerm(title);
    setShowDropdown(false);
  };

  // AI Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setShowDropdown(false); 
    setLoading(true);
    setError('');
    setMovies([]);

    try {
      // UPDATED: Now posts to your live cloud AI
      const aiResponse = await fetch(`${AI_API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: searchTerm })
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        setError(aiData.error || 'Movie not found in our AI database. Try another one!');
        setLoading(false);
        return;
      }

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

  // Watchlist save function
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
      // Note: This still points to your local Node.js server for now!
      const response = await fetch('https://susa000-movie-node-backend.hf.space/api/user/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      
      <div className="search-wrapper" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            className="search-input"
            placeholder="e.g. Interstellar, The Matrix, Iron Man..." 
            value={searchTerm}
            onChange={handleTyping}
            onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            {loading ? 'Thinking...' : 'Discover'}
          </button>
        </form>

        {showDropdown && filteredTitles.length > 0 && (
          <ul className="autocomplete-dropdown">
            {filteredTitles.map((title, index) => (
              <li 
                key={index} 
                onClick={() => handleSelectMovie(title)}
                className="dropdown-item"
              >
                {title}
              </li>
            ))}
          </ul>
        )}
      </div>

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