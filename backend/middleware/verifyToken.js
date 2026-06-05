const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get the token from the request headers
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Tokens are usually sent as "Bearer [token_string]", so we split it to get just the string
        const token = authHeader.split(" ")[1];

        // 2. Verify the token using your secret key
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid or has expired!" });
            }
            
            // 3. If valid, attach the decoded user info (like their ID) to the request and move to the next function
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "You are not authenticated! No token provided." });
    }
};

module.exports = verifyToken;