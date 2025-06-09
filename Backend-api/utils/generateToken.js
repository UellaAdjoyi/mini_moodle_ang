const jwt= require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    }

module.exports = generateToken;
// This function generates a JWT token using the user's ID and a secret key from environment variables.