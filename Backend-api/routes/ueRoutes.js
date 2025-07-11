const express = require('express');
const router = express.Router();
const {
   getAllUes,
    createUe,
    updateUe,
    deleteUe,
} = require('../controllers/ueController');

const postRouterForUe = require('./postRoutes');

const { protect } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload");
const authenticateUser = require("../middlewares/authenticateUser");
const {getProfDashboardStats, getCoursesByEnseignant} = require("../controllers/profDashbordController");

// Routes pour /api/courses
router.route('/')
    .get( getAllUes)
    .post(protect, upload.single('image'), createUe);

router.get('/ueall', getAllUes)   
    
router.route('/:id')
    .put(protect, upload.single('image'), updateUe)
    .delete(protect, deleteUe);


router.use('/:ueId/posts', postRouterForUe);

router.get('/participants',authenticateUser, getCoursesByEnseignant);
router.get('/statistiques',authenticateUser,getProfDashboardStats);


module.exports = router;