const app = require('./src/app')

let PORT = 3000
const MAX_TRIES = 100
function startServer(port, attempts = 0) {
    if (attempts >= MAX_TRIES) {
        console.error(`超过最大尝试次数，启动失败`);
        process.exit(1)
    }
    const server = app.listen(port)
    server.once('listening', () => {
        console.log(`Server运行在http://localhost:${port}`);
    })
    server.once('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`端口${port}已被占用，尝试使用端口${port}`);
            startServer(port + 1, attempts + 1)
            return
        }
        console.error('启动时发生错误：', err);
        process.exit(1)
    })
}

startServer(PORT)