// backend-api/routes/postRoutes.js
const express = require('express');
// `mergeParams: true` est nécessaire pour que les routes imbriquées puissent accéder aux paramètres de la route parente (ex: :ueId)
const router = express.Router({ mergeParams: true });

const {
    createPostInUe,
    createPost,
    getPostsByUe,
    getPostById,     // Sera sur un autre routeur ou une route distincte
    updatePost,      // Sera sur un autre routeur ou une route distincte
    deletePost       // Sera sur un autre routeur ou une route distincte
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// Ces routes seront montées via le routeur des UEs sur /api/ues/:ueId/posts
router.route('/')
    .post(protect, createPostInUe)
    // .post(protect, createPost)
    .get(protect, getPostsByUe);
   


module.exports = router;// Ce routeur est pour les routes imbriquées