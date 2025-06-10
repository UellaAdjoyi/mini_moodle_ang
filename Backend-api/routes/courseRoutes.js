const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

// Routes pour /api/courses
router.route('/')
  .get(getAllCourses)   // GET /api/courses
  .post(createCourse);  // POST /api/courses

router.route('/:id')
  .get(getCourseById)   // GET /api/courses/un-certain-id
  .put(updateCourse)    // PUT /api/courses/un-certain-id
  .delete(deleteCourse); // DELETE /api/courses/un-certain-id

module.exports = router;