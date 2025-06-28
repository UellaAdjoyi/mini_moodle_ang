const express = require('express');
const router = express.Router();

const {
    getPostById,
    getPostsByUe,
    updatePost,
    deletePost,
    createPost,
    createFilePost,
    getAllPosts,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/postAll', getAllPosts);

router.route('/:postId')
    .get(protect, getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

const multer = require('multer');
const upload = multer();
router.post('/createPost', upload.none(), createPost);
const {uploadSingle} = require("../middlewares/uploadPost");

router.post('/createFilePost', uploadSingle, createFilePost);

router.get('/showPosts/:codeUe', getPostsByUe);


module.exports = router;