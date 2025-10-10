const db = require('../../db')
const { BLOG_CODE } = require('../../util/constant')
class BlogModel {
    static async createBlog(blogData) {
        return new Promise((resolve, reject) => {
            const {
                content,
                user_id
            } = blogData
            const sql = `INSERT INTO blog (content, user_id) VALUES (?,?)`
            db.run(sql, [content, user_id], (err) => {
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