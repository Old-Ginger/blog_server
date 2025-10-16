const Router = require('koa-router')
const router = new Router()
const {
    createBlog,
    getBlogList
} = require('../controllers/blogController')

router.post('/getBlogList', getBlogList)
router.post('/postBlog', createBlog)

module.exports = router