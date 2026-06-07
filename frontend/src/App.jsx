import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import AiSearch from './pages/AiSearch';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div style={{ paddingTop: '70px' }}></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/ai-match" element={<AiSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App