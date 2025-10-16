const db = require('../../db')
const { BLOG_CODE } = require('../../util/constant')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

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
                name,
                ts
            } = userData
            const sql = `SELECT * FROM user WHERE name = ? AND phone = ? AND password = ?`
            db.get(sql, [name, phone, password], (err, row) => {
                if (err) {
                    reject({
                        respCd: BLOG_CODE.FAIL,
                        respMsg: err.message
                    })
                } else {
                    console.log('userLogin success!');
                    if (!row) {
                        resolve({
                            respCd: BLOG_CODE.FAIL,
                            respMsg: '用户不存在，请注册！'
                        })
                        return
                    }
                    const { id } = row
                    const payload = { id, name, phone, ts }
                    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
                    resolve({
                        respCd: BLOG_CODE.SUCCESS,
                        respMsg: '用户登录成功',
                        data: {
                            //todo: 根据user_id生成token返回，前端保存在请求头当中
                            user: {
                                id,
                                name,
                            },
                            token
                        }
                    })
                }
            })
        })
    }
}

module.exports = UserModel