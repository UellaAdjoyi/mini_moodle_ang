const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware'); // Si vous avez ce middleware

// Seuls les admins peuvent voir tous les logs
router.route('/')
    .get(protect, authorize('admin'), getAllLogs); // Utilisez votre middleware d'autorisation de rôle

module.exports = router;