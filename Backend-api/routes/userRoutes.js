const express = require('express');
const router = express.Router();
const {
    getUserCourses
   
} = require('../controllers/userController');

router.get('/:userId/cours', getUserCourses);
router.post('/remove-ue', removeUserCourse);
module.exports = router;