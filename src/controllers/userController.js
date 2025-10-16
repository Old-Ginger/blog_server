const UserModel = require('../models/userModel')
const { BLOG_CODE } = require('../../util/constant')

/**
 * 创建用户
 * @param {*} ctx 
 * @returns 
 */
exports.createUser = async (ctx) => {
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

/**
 * 登录请求
 * @param {*} ctx 
 * @returns 
 */
exports.checkUserLogin = async (ctx) => {
    const {
        phone,
        password,
        name
    } = ctx.request.body

    if (!phone || !password || !name) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.FAIL,
            respMsg: '用户信息不全！'
        }
        return
    } else {
        const result = await UserModel.checkUser({ phone, password, name })
        if (result.respCd === BLOG_CODE.SUCCESS) {
            const { token } = result.data
            ctx.set('token', token)
        }
        ctx.status = 201
        ctx.body = result
    }
}