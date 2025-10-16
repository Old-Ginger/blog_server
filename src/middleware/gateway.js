const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const PUBLIC_PATHS = new Set([
    '/',
    '/user',
    '/userLogin',
    '/register'
])

module.exports = async (ctx, next) => {
    console.log('------ gateway middleware ------');
    const token = ctx.headers?.token
    console.log('token = ', token);

    // if (!token) {
    //     ctx.status = 401
    //     ctx.body = {
    //         respCd: '401',
    //         respMsg: '用户信息不存在，请注册登录'
    //     }
    //     return
    // }

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            ctx.state.user = decoded
            return await next()
        } catch (error) {
            ctx.status = 401
            ctx.body = {
                respCd: '401',
                respMsg: '无效的token，请重新登录'
            }
        }
    }

    if (ctx.method === 'OPTIONS' || PUBLIC_PATHS.has(ctx.path)) {
        return await next()
    }



}
