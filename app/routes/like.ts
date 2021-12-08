import Router from 'koa-router'
import { Like } from '@controllers'
import { getTokenId, addLog } from './middleware'

const { add, delete: disLike, getMyLikes } = Like

const router = new Router({
  prefix: '/like',
})

router.post('/add', getTokenId, add, addLog)

router.post('/delete', getTokenId, disLike, addLog)

router.get('/getMyLikes', getTokenId, getMyLikes, addLog)

export default router
