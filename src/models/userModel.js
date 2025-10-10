const db = require('../../db')
const { BLOG_CODE } = require('../../util/constant')
class UserModel {

    /**
     * @description 创建新用户
     * @param {object} userData 
     */
    static async createUser(userData) {
        return new Promise((resolve, reject) => {
            const {
                name,
                password,
                phone
            } = userData
            console.log('userData = ', userData);

            const sql = `INSERT INTO user (name, password,phone) VALUES (?,?,?)`
            db.run(sql, [name, password, phone], (err) => {
                console.log('err = ', err);

                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    });
                } else {
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: err?.message,
                        data: {
                            id: this.lastID,
                            name,
                            token: ''
                        }
                    });
                }
            })
        })
    }

    static async checkUser(userData) {
        return new Promise((resolve, reject) => {
            const {
                phone,
                password,
                name
            } = userData
            const sql = `SELECT * FROM user WHERE name = ? AND phone = ? AND password = ?`
            console.log('sql = ', sql);
            db.get(sql, [name, phone, password], (err) => {
                console.log('err = ', err);

                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    })
                } else {
                    console.log('userLogin success!');

                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '用户登录成功',
                        data: {
                            //todo: 根据user_id生成token返回，前端保存在请求头当中
                        }
                    })
                }
            })
        })
    }
}

module.exports = UserModel