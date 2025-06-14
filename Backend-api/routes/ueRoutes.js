const express = require('express');
const router = express.Router();
const {
   getAllUes,
    getUeById,
    createUe,
    updateUe,
    deleteUe,
} = require('../controllers/ueController');

const postRouterForUe = require('./postRoutes');

const { createForumForUe, getForumByUe } = require('../controllers/forumController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload");

// Routes pour /api/courses
router.route('/')
    .get(protect, getAllUes)
    .post(protect, upload.single('image'), createUe);

router.get('/ueall', getAllUes)   
    
router.route('/:id')
    .put(protect, upload.single('image'), updateUe)
    .delete(protect, deleteUe);


router.use('/:ueId/posts', postRouterForUe);

router.route('/:ueId/forum')
    .post(protect, createForumForUe)  // Créer le forum pour l'UE
    .get(protect, getForumByUe);     // Récupérer le forum de l'UE


module.exports = router;