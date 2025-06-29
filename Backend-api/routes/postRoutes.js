const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    getPostsByUe,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getPostsByUe);


module.exports = router;