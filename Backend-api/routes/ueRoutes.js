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

const { protect } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload");

// Routes pour /api/courses
router.route('/')
    .get(protect, getAllUes)
    .post(protect, upload.single('image'), createUe);

router.route('/:id')
    .put(protect, upload.single('image'), updateUe)
    .delete(protect, deleteUe);

router.route('/:id/enroll')
    .post(protect, enrollUe);

router.route('/:id/unenroll')
    .post(protect, unenrollUe);


module.exports = router;