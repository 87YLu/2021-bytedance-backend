import Router from 'koa-router'
import { News } from '@controllers'
import { getTokenId, addLog } from './middleware'
const { getNewsDigest, getNewsItem, getNewsType } = News

const router = new Router({
  prefix: '/news',
})

router.get('/getNewsDigest', getTokenId, getNewsDigest, addLog)

router.get('/getNewsItem', getTokenId, getNewsItem, addLog)

router.get('/visitorGetNewsDigest', getNewsDigest)

router.get('/visitorGetNewsItem', getNewsItem)

router.get('/getNewsType', getNewsType)

export default router
