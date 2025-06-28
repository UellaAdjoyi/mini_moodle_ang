const express = require('express');
const router = express.Router();
const { getAllLogs, createLog } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware'); // Si vous avez ce middleware



// route pour créer un log 
const multer = require('multer');
const upload = multer();
router.post('/createLog', upload.none(), createLog); 

// afficher tous les logs
router.get('/logAll',getAllLogs ) 

// Seuls les admins peuvent voir tous les logs
router.route('/')
    .get(protect, authorize('admin'), getAllLogs); // Utilisez votre middleware d'autorisation de rôle
module.exports = router;