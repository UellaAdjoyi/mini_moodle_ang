const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/', forumController.createForum);
router.get('/ue/:ue_id', forumController.getForumsByUE);
router.get('/:id', forumController.getForumById);
router.post('/:id/messages', forumController.addMessageToForum);

module.exports = router;
