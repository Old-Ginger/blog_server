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

exports.followUser = async (ctx) => {
    const {
        follower_id
    } = ctx.request.body
    const {
        id
    } = ctx.state.user
    console.log('follower_id === ', follower_id, ctx.state.user);

    if (!follower_id || !id) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.FAIL,
            respMsg: '关注信息不合法！'
        }
        return
    } else {
        const result = await UserModel.followUser({ follower_id, id })
        ctx.status = 201
        ctx.body = result
    }
}

// 获取用户关注、被关注的信息,
exports.getUserFollowInfo = async (ctx) => {
    const {
        user_id
    } = ctx.request.body
    if (!user_id) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.FAIL,
            respMsg: '用户信息不合法！'
        }
        return
    } else {
        const followerCount = await UserModel.countFollowers({ id: user_id })
        const followeeCount = await UserModel.countFollowees({ id: user_id })
        console.log('followerCount = ', followeeCount, followerCount);

        ctx.status = 200
        ctx.body = {
            respCd: BLOG_CODE.SUCCESS,
            respMsg: '获取成功',
            data: {
                followerCount: followerCount.data.followerCount,    //粉丝人数
                followeeCount: followeeCount.data.followeeCount     //关注人数
            }
        }
    }
}

exports.getUserInfo = async (ctx) => {
    const {
        user_id
    } = ctx.request.body
    if (!user_id) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.FAIL,
            respMsg: '用户信息不合法！'
        }
        return
    } else {
        const result = await UserModel.getUserInfo({ id: user_id })
        console.log('result = ', result);

        ctx.status = 200
        ctx.body = {
            respCd: BLOG_CODE.SUCCESS,
            respMsg: '获取成功',
            data: {
                name: result.data.name,
                phone: result.data.phone
            }
        }
    }
}