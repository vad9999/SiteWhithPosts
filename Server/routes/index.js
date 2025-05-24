const express = require('express')
const router = express.Router()

const userRoutes = require('./users')
const postRoutes = require('./posts')
const commentRoutes = require('./comments')
const roleRoutes = require('./roles')

router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/roles', roleRoutes)

module.exports = router