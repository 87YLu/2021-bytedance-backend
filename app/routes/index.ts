import Router from 'koa-router'
import collection from './collection'
import comment from './comment'
import like from './like'
import log from './log'
import user from './user'
import news from './news'

const router = new Router({
  prefix: '/api',
})

const routers = [collection, comment, like, log, user, news]

routers.forEach(route => {
  router.use(route.routes()).use(route.allowedMethods())
})

export default router
