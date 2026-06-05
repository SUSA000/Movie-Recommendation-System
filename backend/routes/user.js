const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // Import the bouncer

// ADD MOVIE TO WATCHLIST (Protected Route)
router.post('/watchlist', verifyToken, async (req, res) => {
    try {
        // req.user.id comes directly from our verifyToken middleware!
        const user = await User.findById(req.user.id);
        
        // Prevent saving the exact same movie twice
        const isAlreadySaved = user.savedMovies.find(movie => movie.movieId === req.body.movieId);
        if (isAlreadySaved) {
            return res.status(400).json({ message: "Movie is already in your watchlist!" });
        }

        // Add the new movie data from the request body into the array
        user.savedMovies.push(req.body);
        const updatedUser = await user.save();

        res.status(200).json(updatedUser.savedMovies);
    } catch (err) {
        res.status(500).json({ message: "Error adding movie", error: err.message });
    }
});

// GET USER WATCHLIST (Protected Route)
router.get('/watchlist', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.savedMovies);
    } catch (err) {
        res.status(500).json({ message: "Error fetching watchlist", error: err.message });
    }
});

module.exports = router;