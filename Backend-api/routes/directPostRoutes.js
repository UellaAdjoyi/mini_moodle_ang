const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
    getPostById,
    getPostsByUe,
    updatePost,
    deletePost,
    createPost,
    createFilePost,
    getAllPosts,
} = require('../controllers/postController'); // Même contrôleur

// route pour créer un post (message)
const multer = require('multer');
const upload = multer();
router.post('/createPost',protect, upload.none(), createPost);

// route pour créer un post (fichier)
const {uploadSingle} = require("../middlewares/uploadPost");
const authenticateUser = require("../middlewares/authenticateUser");
router.post('/createFilePost', uploadSingle,protect, createFilePost);

// afficher les posts en fonctions des ue
router.get('/showPosts/:codeUe', getPostsByUe);

// afficher tous les posts
router.get('/postAll',getAllPosts ) 

// supprimer un post
router.delete('/deletePost/:id', deletePost);

// modifier un post
router.put('/profile', uploadSingle,protect, updatePost);

router.route('/:postId')
    .get( getPostById)
    .put(upload.single('fichier'),protect, updatePost)
    .delete( protect,deletePost);





module.exports = router;