const UserModel = require('../models/userModel')
const { BLOG_CODE } = require('../../util/constant')
exports.createUser = async (ctx) => {
    console.log('ctx ========= ', ctx.request);
    const { name, password, phone } = ctx.request.body
    if (!name || !password || !phone) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '用户信息不全！'
        }
        return
    }
    try {
        const result = await UserModel.createUser({ name, password, phone })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

exports.checkUserLogin = async (ctx) => {
    const {
        phone,
        password,
        name
    } = ctx.request.body
    console.log('ctx =========  ', ctx);

    if (!phone || !password || !name) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.FAIL,
            respMsg: '用户信息不全！'
        }
        return
    } else {
        const result = await UserModel.checkUser({ phone, password, name })
        console.log('result = ', result);

        ctx.status = 201
        ctx.body = result
    }
}