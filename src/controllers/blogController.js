const BlogModel = require('../models/blogModel')
const { BLOG_CODE } = require('../../util/constant')

exports.createBlog = async (ctx) => {
    const {
        blog,
        ts
    } = ctx.request.body
    const {
        id,
        name
    } = ctx.state.user
    if (!blog) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '博客内容不能为空！'
        }
        return
    }
    try {
        const result = await BlogModel.createBlog({
            blog,
            user_id: id,
            title: name,
            created_at: ts
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

exports.getBlogList = async (ctx) => {
    const {
        lastBlogId,
        page,
        pageSize
    } = ctx.request.body
    const {
        id
    } = ctx.state.user
    try {
        const result = await BlogModel.getBlogList({
            user_id: id,
            page,
            pageSize,
            blog_id: lastBlogId
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}