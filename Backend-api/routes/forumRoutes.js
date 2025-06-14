// backend-api/routes/forumRoutes.js
const express = require('express');
const router = express.Router(); // Pas besoin de mergeParams ici si les routes sont directes
const {
    addMessageToForum,
    updateForumDetails,
    // getForumById (si on veut une route pour obtenir un forum par son ID direct)
} = require('../controllers/forumController');
const { protect } = require('../middlewares/authMiddleware');

// Route pour mettre à jour les détails d'un forum (titre/description)
router.route('/:forumId')
    .put(protect, updateForumDetails);
    // .get(protect, getForumById); // Si on ajoute getForumById au contrôleur

// Route pour ajouter un message à un forum spécifique
router.route('/:forumId/messages')
    .post(protect, addMessageToForum);

module.exports = router;