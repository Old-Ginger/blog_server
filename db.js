//能提供更详细、更有用的错误信息和堆栈跟踪
const sqlite = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.join(__dirname, 'src', 'data', 'user.db')
const db = new sqlite.Database(dbPath, (err) => {
    console.log('err', err);

    if (err) {
        console.error('数据库连接失败', err.message);
    } else {
        console.log('数据库连接成功');
    }
})

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;")
    db.run(`
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('创建user表失败:', err.message)
        } else {
            console.log('用户表初始化成功！');
        }
    })
    db.run(`
        CREATE TABLE IF NOT EXISTS blog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            favor_num INTEGER,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
          );
    `, (err) => {
        if (err) {
            console.error('创建blog表失败:', err.message)
        } else {
            console.log('用户博客内容表初始化成功！');
        }
    })
    db.run(`CREATE INDEX IF NOT EXISTS idx_blog_user_id ON blog(user_id)`)
})
module.exports = db;