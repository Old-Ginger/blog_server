const Router = require('koa-router')
const router = new Router()
const {
    createUser,
    checkUserLogin,
    getUserFollowInfo,
    followUser,
    getUserInfo
} = require('../controllers/userController')
router.get('/', async (ctx) => {
    ctx.body = {
        respCd: '000000',
        respMsg: 'hello world!!!'
    }
})

router.post('/user', createUser)
router.post('/userLogin', checkUserLogin)

router.post('/register', async (ctx) => {
    ctx.body = {
        respCd: '000000',
        respMsg: '新建用户成功'
    }
})
router.post('/getUserInfo', getUserInfo)
router.post('/followUser', followUser)
router.post('/getFollowInfo', getUserFollowInfo)
module.exports = router