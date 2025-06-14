const express = require('express');
const router = express.Router();
const {
    getUserCourses
   
} = require('../controllers/userController');

router.get('/:id/cours', getUserCourses);

module.exports = router;