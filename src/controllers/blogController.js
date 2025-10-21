const BlogModel = require('../models/blogModel')
const { BLOG_CODE } = require('../../util/constant')

// 创建博客
exports.createBlog = async (ctx) => {
    const {
        blog,
        origin_blog_id
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
            origin_blog_id

        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

// 获取博客列表
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

// 博客点赞
exports.favorBlog = async (ctx) => {
    const {
        blog_id
    } = ctx.request.body
    const {
        id
    } = ctx.state.user
    if (!blog_id) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '博客ID不能为空！'
        }
        return
    }
    try {
        const result = await BlogModel.favorBlog({
            blog_id,
            user_id: id
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

// 取消博客点赞
exports.unfavorBlog = async (ctx) => {
    const {
        blog_id
    } = ctx.request.body
    if (!blog_id) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '博客ID不能为空！'
        }
        return
    }
    try {
        const result = await BlogModel.unfavorBlog({
            blog_id
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

// 博客评论
exports.commentBlog = async (ctx) => {
    const {
        blog_id,
        comment
    } = ctx.request.body
    const {
        id,
        name
    } = ctx.state.user
    if (!blog_id || !comment) {
        ctx.status = 400
        ctx.body = {
            respCd: BLOG_CODE.Fail,
            respMsg: '博客ID和评论内容不能为空！'
        }
        return
    }
    try {
        const result = await BlogModel.commentBlog({
            blog_id,
            comment,
            user_id: id,
            user_name: name
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}

// 获取博客评论列表
exports.blogCommentList = async (ctx) => {
    const {
        blog_id,
        pageSize = 10
    } = ctx.request.body
    try {
        const result = await BlogModel.blogCommentList({
            blog_id,
            pageSize
        })
        ctx.status = 201
        ctx.body = result
    } catch (error) {
        ctx.status = 400
        ctx.body = error
    }
}
// module.exports = {
//     createBlog,
//     getBlogList
// }