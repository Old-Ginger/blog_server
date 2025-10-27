const Router = require('koa-router')
const router = new Router()
const {
    createBlog,
    getBlogList,
    favorBlog,
    unfavorBlog,
    commentBlog,
    blogCommentList,
    getSpecificBlogList
} = require('../controllers/blogController')

router.post('/getBlogList', getBlogList)
router.post('/getSpecificBlogList', getSpecificBlogList)
router.post('/postBlog', createBlog)
router.post('/favorBlog', favorBlog)
router.post('/unfavorBlog', unfavorBlog)
router.post('/commentBlog', commentBlog)
router.post('/blogCommentList', blogCommentList)

module.exports = router