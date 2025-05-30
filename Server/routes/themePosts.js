const express = require('express')
const router = express.Router()
const themePostController = require('../controllers/themePostController')

router.get('/', themePostController.getThemePosts)
router.get('/:id', themePostController.getThemePost)  
router.post('/', themePostController.addThemePost)           
router.put('/:id', themePostController.updateThemePost)
router.delete('/:id', themePostController.deleteThemePost)   

module.exports = router