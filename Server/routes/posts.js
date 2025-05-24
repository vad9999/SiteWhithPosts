const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', postController.getPosts)
router.get('/:id', postController.getOnePost)
router.post('/', postController.addPost)
router.put('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)
router.get('/user/:userId', postController.getUserPost)

module.exports = router