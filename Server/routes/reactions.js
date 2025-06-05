const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.post('/toggle', reactionController.toggleReaction);
router.post('/posts', reactionController.getReactionsForPosts);

module.exports = router;
