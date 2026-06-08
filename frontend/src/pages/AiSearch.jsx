import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player'; // Import the player!
import './Home.css'; 
import './AiSearch.css'; 

const AI_API_BASE_URL = "https://susa000-movie-ai-backend.hf.space";

const AiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [allMovieTitles, setAllMovieTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        const response = await fetch(`${AI_API_BASE_URL}/api/movies`);
        const data = await response.json();
        setAllMovieTitles(data);
      } catch (err) {
        console.error("Could not load movie titles for autocomplete.", err);
      }
    };
    fetchMovieTitles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSelectMovie = (title) => {
    setSearchTerm(title);
    setShowDropdown(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setShowDropdown(false); 
    setLoading(true);
    setError('');
    setMovies([]);

    try {
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
    <div className="ai-search-container">
      <div className="ai-hero">
        <h1 className="ai-page-title">Cine<span className="text-red">AI</span> Matchmaker</h1>
        <p className="ai-subtitle">Uncover your next favorite movie with our deep-learning recommendation engine.</p>
        
        <div className="search-wrapper" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              className="search-input"
              placeholder="Enter a movie you love (e.g., Interstellar)..." 
              value={searchTerm}
              onChange={handleTyping}
              onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
              autoComplete="off"
            />
            <button type="submit" className="search-btn">
              {loading ? 'Analyzing...' : 'Discover'}
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
      </div>

      {/* --- PROFESSIONAL EMPTY STATE --- */}
      {!loading && movies.length === 0 && !error && (
        <div className="empty-state-container">
          
          {/* Lottie Animation */}
          <div className="lottie-hero-wrapper">
            <Player
              autoplay
              loop
              src="/Cinema.json" /* Points directly to the public folder */
              style={{ height: '180px', width: '180px' }}
            />
          </div>
          
          <p className="empty-state-text">Awaiting your input to generate personalized matches.</p>

          {/* Professional Features Grid */}
          <div className="ai-features-grid">
            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h4>Neural Network</h4>
              <p>Analyzes complex patterns to find movies with the exact same pacing, tone, and themes.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h4>Instant Matches</h4>
              <p>Powered by our advanced cloud infrastructure to deliver real-time cinematic results.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h4>High Precision</h4>
              <p>Goes beyond simple genres to find hidden gems you are guaranteed to love.</p>
            </div>
          </div>

        </div>
      )}

      {error && <div className="error-container"><p className="error-msg">{error}</p></div>}
      
      {movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-actions">
                  <p className="rating">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
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