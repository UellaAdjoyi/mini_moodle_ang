// backend-api/routes/postRoutes.js
const express = require('express');
// `mergeParams: true` est nécessaire pour que les routes imbriquées puissent accéder aux paramètres de la route parente (ex: :ueId)
const router = express.Router({ mergeParams: true });

const {
    createPostInUe,
    getPostsByUe,
    getPostById,     // Sera sur un autre routeur ou une route distincte
    updatePost,      // Sera sur un autre routeur ou une route distincte
    deletePost       // Sera sur un autre routeur ou une route distincte
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// Ces routes seront montées via le routeur des UEs sur /api/ues/:ueId/posts
router.route('/')
    .post(protect, createPostInUe)
    .get(protect, getPostsByUe);

// Les routes pour manipuler un post spécifique par son ID pourraient être sur un routeur séparé au niveau racine /api/posts
// Ou, si on veut les garder imbriquées (ce qui rend les permissions plus complexes à gérer globalement mais logique pour le contexte) :
// router.route('/:postId') // deviendrait /api/ues/:ueId/posts/:postId
//     .get(protect, getPostById)
//     .put(protect, updatePost)
//     .delete(protect, deletePost);
// Pour l'instant, on va créer un routeur séparé pour /api/posts/:postId pour plus de clarté.

module.exports = router; // Ce routeur est pour les routes imbriquées