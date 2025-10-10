const BlogModel = require('../models/blogModel')
const { BLOG_CODE } = require('../../util/constant')

exports.createBlog = async (ctx) => {
    const { content } = ctx.request.body
    // todo: 解析请求头当中的token，把token转成对应的user_id
    if (!content) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '博客内容不能为空！'
        }
        return
    }
    try {
        const result = await BlogModel.createBlog({ content })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}