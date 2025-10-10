const Router = require('koa-router')
const router = new Router()
const {
    createUser,
    checkUserLogin
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

module.exports = router