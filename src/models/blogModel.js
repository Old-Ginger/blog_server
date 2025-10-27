const db = require('../../db')
const { BLOG_CODE } = require('../../util/constant')
class BlogModel {
    /**
     * 获取自己发过的博客列表
     * @param {*} blogData 
     * @returns 
     */
    static async getBlogList(blogData) {
        return new Promise((resolve, reject) => {
            const {
                user_id,
                page,
                pageSize,
                blog_id,
                privacy_level
            } = blogData
            const blog_favor_sql = `
            SELECT 
                b.*,
                CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
                o.id AS original_blog_id,
                o.title AS original_blog_title,
                o.content AS original_blog_content,
                o.user_id AS original_blog_user_id,
                o.created_at AS original_blog_created_at
            FROM 
                blog b
            LEFT JOIN 
                blog o 
                ON b.original_blog_id = o.id
            LEFT JOIN 
            blog_favor l 
                ON b.id = l.blog_id AND l.user_id = ?
            WHERE b.privacy_level <= ?
            ORDER BY 
                b.created_at DESC
            LIMIT ?;`
            db.all(blog_favor_sql, [user_id, privacy_level, pageSize], (err, rows) => {
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '查询成功',
                        data: rows
                    });
                }
            })
        })
    }

    static async getSpecificBlogList(blogData) {
        return new Promise((resolve, reject) => {
            const {
                user_id,
                page,
                pageSize,
                blog_id
            } = blogData
            const blog_favor_sql = `
            SELECT 
                b.*,
                CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_liked,
                o.id AS original_blog_id,
                o.title AS original_blog_title,
                o.content AS original_blog_content,
                o.user_id AS original_blog_user_id,
                o.created_at AS original_blog_created_at
            FROM 
                blog b
            LEFT JOIN 
                blog o 
                ON b.original_blog_id = o.id
            LEFT JOIN 
            blog_favor l 
                ON b.id = l.blog_id AND l.user_id = ?
            WHERE
             b.user_id = ?
            ORDER BY 
                b.created_at DESC
            LIMIT ?;`
            db.all(blog_favor_sql, [user_id, user_id, pageSize], (err, rows) => {
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '查询成功',
                        data: rows
                    });
                }
            })
        })
    }

    static async createBlog(blogData) {
        return new Promise((resolve, reject) => {
            const {
                blog,
                user_id,
                title,
                origin_blog_id,
                privacy_level
            } = blogData
            const sql = `INSERT INTO blog (content
            , user_id,
            title,
            original_blog_id,
            created_at,privacy_level) VALUES (?,?,?,?,datetime('now'), ?)`
            db.run(sql, [blog, user_id, title,
                origin_blog_id, privacy_level], (err, row) => {
                    if (err) {
                        reject({
                            respCd: BLOG_CODE.FAIL,
                            respMsg: err.message
                        });
                    } else {
                        resolve({
                            respCd: BLOG_CODE.SUCCESS,
                            respMsg: err?.message
                        });
                    }
                })
        })
    }

    static async favorBlog(blogData) {
        const {
            blog_id,
            user_id
        } = blogData
        return new Promise((resolve, reject) => {
            const ifFavor_sql = `SELECT * FROM blog_favor WHERE blog_id = ? AND user_id = ?`
            db.get(ifFavor_sql, [blog_id, user_id], (err, row) => {
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    if (row) {
                        // 已经点过赞了
                        resolve({
                            respCd: BLOG_CODE.FAIL,
                            respMsg: '您已经点过赞了，不能重复点赞哦~'
                        });
                    } else {
                        // 未点赞，进行点赞操作
                        const sql = `INSERT INTO blog_favor (blog_id, user_id, created_at) VALUES (?, ?, datetime('now'))`
                        db.run(sql, [blog_id, user_id], (err, row) => {
                            console.log('row ==== ', row);

                            console.log('err = ', err);
                            if (err) {
                                reject({
                                    respCd: BLOG_CODE.FAIL,
                                    respMsg: err.message
                                });
                            } else {
                                resolve({
                                    respCd: BLOG_CODE.SUCCESS,
                                    respMsg: '点赞成功！'
                                });
                            }
                        })
                    }
                }
            })

        })
    }

    static async commentBlog(blogData) {
        const {
            blog_id,
            comment,
            user_id,
            user_name
        } = blogData
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO blog_comment (blog_id, user_id, user_name,content, created_at) VALUES (?, ?, ?, ?, datetime('now'))`
            db.run(sql, [blog_id, user_id, user_name, comment], (err, row) => {
                console.log('row ==== ', row);

                console.log('blog_comment err = ', err);
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '评论成功！'
                    });
                }
            })
        })
    }

    static async blogCommentList(blogData) {
        return new Promise((resolve, reject) => {
            const {
                blog_id,
                pageSize
            } = blogData

            const sql = `SELECT * FROM blog_comment WHERE blog_id = ? AND id >= ? ORDER BY id ASC LIMIT ?`
            db.all(sql, [blog_id, 1, pageSize], (err, rows) => {
                console.log('rows ==== ', rows);

                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '查询成功',
                        data: rows
                    });
                }
            })
        })
    }

    static async unfavorBlog(blogData) {
        const {
            blog_id,
            user_id
        } = blogData
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM blog_favor WHERE blog_id = ? AND user_id = ?`
            db.run(sql, [blog_id, user_id], (err, row) => {
                console.log('row ==== ', row);

                console.log('err = ', err);
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '取消点赞成功！'
                    });
                }
            })
        })
    }
}
module.exports = BlogModel