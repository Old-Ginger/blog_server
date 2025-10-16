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
                blog_id
            } = blogData
            console.log('======blogData===== ', blogData);

            const sql = `SELECT * FROM blog WHERE user_id = ?AND id >= ? ORDER BY id ASC LIMIT ?`
            db.all(sql, [user_id, blog_id, pageSize], (err, rows) => {
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

    static async createBlog(blogData) {
        return new Promise((resolve, reject) => {
            console.log('======blogData===== ', blogData);

            const {
                blog,
                user_id,
                title,
                created_at
            } = blogData
            const sql = `INSERT INTO blog (content
            , user_id,
            title,
            created_at) VALUES (?,?,?,?)`
            db.run(sql, [blog, user_id, title,
                created_at], (err) => {
                    console.log('err = ', err);
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
}

module.exports = BlogModel