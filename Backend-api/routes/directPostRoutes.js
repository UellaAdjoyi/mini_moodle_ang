const express = require('express');
const router = express.Router();

const {
    getPostById,
    updatePost,
    deletePost
} = require('../controllers/postController'); // Même contrôleur
const { protect } = require('../middlewares/authMiddleware');

router.route('/:postId')
    .get(protect, getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

// Ici, on pourrait aussi ajouter des routes pour la gestion des devoirs remis, par exemple :
// router.route('/:postId/submit').post(protect, submitAssignment);
// router.route('/:postId/submissions').get(protect, authorize('prof', 'admin'), getSubmissionsForPost);
// router.route('/:postId/submissions/:submissionId/grade').put(protect, authorize('prof', 'admin'), gradeSubmission);


module.exports = router;