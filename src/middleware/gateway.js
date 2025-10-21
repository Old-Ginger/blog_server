const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { BLOG_CODE } = require('../../util/constant')
const PUBLIC_PATHS = new Set([
    '/',
    '/user',
    '/userLogin',
    '/register'
])

module.exports = async (ctx, next) => {
    const token = ctx.headers?.token
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
            console.log('error ==== ', error);

            ctx.status = 401
            ctx.body = {
                respCd: BLOG_CODE.NEED_LOGIN,
                respMsg: '无效的token，请重新登录'
            }
        }
    }

    if (ctx.method === 'OPTIONS' || PUBLIC_PATHS.has(ctx.path)) {
        return await next()
    }



}
