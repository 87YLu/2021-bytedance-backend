import Router from 'koa-router'
import { Collection } from '@controllers'
import { getTokenId, addLog } from './middleware'
const { add, delete: deleteCollection, getMyCollections } = Collection

const router = new Router({
  prefix: '/collection',
})

router.post('/add', getTokenId, add, addLog)

router.post('/delete', getTokenId, deleteCollection, addLog)

router.get('/getMyCollections', getTokenId, getMyCollections, addLog)

export default router
