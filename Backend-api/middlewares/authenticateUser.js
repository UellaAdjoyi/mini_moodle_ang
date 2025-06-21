// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authenticateUser;
