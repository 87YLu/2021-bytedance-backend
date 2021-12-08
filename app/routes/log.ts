import Router from 'koa-router'
import { Log } from '@controllers'
import { getTokenId } from './middleware'

const { getMyLogs } = Log

const router = new Router({
  prefix: '/log',
})

router.get('/getMyLogs', getTokenId, getMyLogs)

export default router
