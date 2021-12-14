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

router.use(collection.routes()).use(collection.allowedMethods())
router.use(comment.routes()).use(comment.allowedMethods())
router.use(like.routes()).use(like.allowedMethods())
router.use(log.routes()).use(log.allowedMethods())
router.use(user.routes()).use(user.allowedMethods())
router.use(news.routes()).use(news.allowedMethods())

export default router
