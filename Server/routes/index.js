const express = require('express')
const router = express.Router()

const userRoutes = require('./users')
const postRoutes = require('./posts')
const commentRoutes = require('./comments')
const themePostRoutes = require('./themePosts')
const reactionRoutes = require('./reactions')

router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/themePosts', themePostRoutes)
router.use('/reactions', reactionRoutes)

module.exports = router