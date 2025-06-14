const express = require('express');
const router = express.Router();
const {
   getAllUes,
    getUeById,
    createUe,
    updateUe,
    deleteUe,
    enrollUe,
    unenrollUe,
} = require('../controllers/ueController');

const postRouterForUe = require('./postRoutes');

const { createForumForUe, getForumByUe } = require('../controllers/forumController');

const { protect } = require('../middlewares/authMiddleware');

// Routes pour /api/courses
router.route('/')
  .get(protect, getAllUes)  // GET /api/courses
  .post(protect, createUe);  // POST /api/courses

router.route('/:id')
    .get(getUeById)
    .put(updateUe)
    .delete(deleteUe);

router.route('/:id/enroll').post(enrollUe);
router.route('/:id/unenroll').post(unenrollUe);

router.use('/:ueId/posts', postRouterForUe);

router.route('/:ueId/forum')
    .post(protect, createForumForUe)  // Créer le forum pour l'UE
    .get(protect, getForumByUe);     // Récupérer le forum de l'UE


module.exports = router;