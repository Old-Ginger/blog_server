const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const PUBLIC_PATHS = new Set([
    '/',
    '/user',
    '/userLogin',
    '/register'
])

module.exports = async (ctx, next) => {
    if (ctx.method === 'OPTIONS' || PUBLIC_PATHS.has(ctx.path)) {
        return await next()
    }
    const token = ctx.headers?.token
    if (!token) {
        ctx.status = 401
        ctx.body = {
            respCd: '401',
            respMsg: '用户信息不存在，请注册登录'
        }
        return
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log('decoded = ', decoded);
        ctx.state.user = decoded
        await next()
    } catch (error) {
        ctx.status = 401
        ctx.body = {
            respCd: '401',
            respMsg: '无效的token，请重新登录'
        }
    }
}
