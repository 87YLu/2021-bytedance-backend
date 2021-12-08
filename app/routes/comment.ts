import Router from 'koa-router'
import { Comment } from '@controllers'
import { getTokenId, addLog } from './middleware'

const { add, delete: deleleComment, getMyComments, getComments } = Comment

const router = new Router({
  prefix: '/comment',
})

router.post('/add', getTokenId, add, addLog)

router.post('/delete', getTokenId, deleleComment, addLog)

router.get('/getMyComments', getTokenId, getMyComments, addLog)

router.get('/getComments', getTokenId, getComments, addLog)

export default router
