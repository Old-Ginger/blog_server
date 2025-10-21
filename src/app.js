const Koa = require('koa')
const cors = require('@koa/cors')
const fs = require('fs')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
require('dotenv').config()
const gateway = require('./middleware/gateway')

const routesDir = path.join(__dirname, 'routes')


function loadRoutes(dir) {
    const entries = fs.readdirSync(dir)
    for (const name of entries) {
        const full = path.join(dir, name)
        const stat = fs.statSync(full)
        if (stat.isDirectory()) {
            loadRoutes(full)
            continue
        }
        if (!name.endsWith('.js')) {
            continue
        }
        const mod = require(full)
        mountExport(mod)
    }
}

function mountExport(mod) {
    if (!mod) {
        return
    }
    const exported = mod.__esModule && mod.default ? mod.default : mod

    if (Array.isArray(exported)) {
        exported.forEach(mountExport)
        return
    }
    if (exported && typeof exported.routes === 'function') {
        app.use(exported.routes())
        app.use(exported.allowedMethods())
        return
    }

}

app.use(cors({
    origin: (ctx) => {
        let origin = ['*', 'http://localhost:8000', 'http://172.0.0.1:8000']
        let reqOrigin = ctx.request.header.origin
        console.log(ctx)
        if (origin.indexOf(reqOrigin) > -1) {
            return reqOrigin
        } else {
            return false
        }
    },
    // origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'credential'],
    credentials: true,
    maxAge: 86400
}))
app.use(bodyParser())
app.use(gateway)
app.use(async (ctx, next) => {
    await next();
});
loadRoutes(routesDir)

module.exports = app