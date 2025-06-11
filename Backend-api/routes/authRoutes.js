const express = require('express');
const router = express.Router();
const { // Fonctions du contrôleur d'authentification
    registerUser,
    loginUser,
    getMe
} = require('../controllers/authController'); // Doit pointer vers authController.js
const { protect } = require('../middlewares/authMiddleware');

// Route pour l'enregistrement
router.post('/register', registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour récupérer les infos de l'utilisateur connecté (protégée)
router.get('/me', protect, getMe);

module.exports = router;