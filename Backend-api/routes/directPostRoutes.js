const express = require('express');
const router = express.Router();

const {
    getPostById,
    getPostsByUe,
    updatePost,
    deletePost,
    createPost,
    createFilePost,
    getAllPosts,
} = require('../controllers/postController'); // Même contrôleur
const { protect } = require('../middlewares/authMiddleware');

// route pour créer un post (message)
const multer = require('multer');
const upload = multer();
router.post('/createPost', upload.none(), createPost);

// route pour créer un post (fichier)
const {uploadSingle} = require("../middlewares/uploadPost");
router.post('/createFilePost', uploadSingle, createFilePost);

// afficher les posts en fonctions des ue
router.get('/showPosts/:codeUe', getPostsByUe);

// afficher tous les posts
router.get('/postAll',getAllPosts ) 

// supprimer un post
router.delete('/deletePost/:id', deletePost);

// modifier un post
router.put('/profile', uploadSingle, updatePost);

router.route('/:postId')
    .get( getPostById)
    .put(upload.single('fichier'), updatePost)
    .delete( deletePost);


// Ici, on pourrait aussi ajouter des routes pour la gestion des devoirs remis, par exemple :
// router.route('/:postId/submit').post(protect, submitAssignment);
// router.route('/:postId/submissions').get(protect, authorize('prof', 'admin'), getSubmissionsForPost);
// router.route('/:postId/submissions/:submissionId/grade').put(protect, authorize('prof', 'admin'), gradeSubmission);


module.exports = router;