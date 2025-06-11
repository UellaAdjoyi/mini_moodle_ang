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

// Routes pour /api/courses
router.route('/')
  .get(getAllUes)  // GET /api/courses
  .post(createUe);  // POST /api/courses

router.route('/:id')
    .get(getUeById)
    .put(updateUe)
    .delete(deleteUe);

router.route('/:id/enroll').post(enrollUe);
router.route('/:id/unenroll').post(unenrollUe);

module.exports = router;