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
    // 用户表
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
    // db.run(`DROP TABLE IF EXISTS user_relation`)
    // 用户关系表
    db.run(`
        CREATE TABLE IF NOT EXISTS user_relation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INT NOT NULL,   -- 粉丝（关注者）
            followee_id INT NOT NULL,  -- 被关注者
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (follower_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (followee_id) REFERENCES user(id) ON DELETE CASCADE
        );
    `, (err) => {
        if (err) {
            console.error('创建user_relation表失败:', err.message)
        } else {
            console.log('用户关系表初始化成功！');
        }
    })
    // db.run(`DROP TABLE IF EXISTS blog`)
    // 博客表
    db.run(`
        CREATE TABLE IF NOT EXISTS blog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            title TEXT,
            privacy_level INTEGER DEFAULT 0,  -- 博客隐私权限 0: 公开, 1: 私密, 2: 仅好友可见,
            post_status INTEGER DEFAULT 1,  -- 是否发布 0: 草稿, 1: 已发布, 2: 定时发布, 3:转载,
            original_blog_id INTEGER,  -- 如果是转载的博客，记录原博客ID,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
          );
    `, (err) => {
        if (err) {
            console.error('创建blog表失败:', err.message)
        } else {
            console.log('用户博客内容表初始化成功！');
        }
    })
    // db.run(`DROP TABLE IF EXISTS blog_comment`)
    // 博客评论表
    db.run(`
        CREATE TABLE IF NOT EXISTS blog_comment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            content TEXT NOT NULL,
            parent_id INT DEFAULT NULL,  -- 可为空，用于回复评论
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES blog_comment(id) ON DELETE CASCADE  -- 可选，用于评论的回复
        );
    `, (err) => {
        if (err) {
            console.error('创建blog_comment表失败:', err.message)
        } else {
            console.log('博客评论表初始化成功！');
        }
    })

    // 博客点赞表
    db.run(`
        CREATE TABLE IF NOT EXISTS blog_favor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            blog_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE,
            UNIQUE (user_id, blog_id)
        );
    `, (err) => {
        if (err) {
            console.error('创建blog_favor表失败:', err.message)
        } else {
            console.log('博客点赞表初始化成功！');
        }
    })

    db.run(`CREATE INDEX IF NOT EXISTS idx_blog_created_at ON blog(created_at DESC)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_blog_user_id ON blog(user_id)`)
})
module.exports = db;