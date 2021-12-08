import fs from 'fs'
import Router from 'koa-router'

const router = new Router({
  prefix: '/api',
})

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.ts' && file !== 'middleware') {
    const route = require(`./${file}`)
    router.use(route.default.routes()).use(route.default.allowedMethods())
  }
})

export default router
