import Router from 'koa-router'
import { RateLimit } from 'koa2-ratelimit'
import { User } from '@controllers'
import { getTokenId, addLog } from './middleware'
const {
  create,
  login,
  updateAvatar,
  updatePassword,
  sendCreateMail,
  sendForgotMail,
  resetPassword,
} = User

const router = new Router({
  prefix: '/user',
})

const sendMailLimiter = RateLimit.middleware({
  interval: { min: 1 },
  max: 1,
  handler: async ctx => {
    ctx.status = 429
    ctx.body = {
      message: '请求过快，请稍后再尝试',
      name: 'TooManyRequests',
      status: 429,
      success: false,
    }
  },
})

router.post('/create', create, addLog)

router.post('/login', login, addLog)

router.post('/updateAvatar', getTokenId, updateAvatar, addLog)

router.post('/updatePassword', getTokenId, updatePassword, addLog)

router.get('/sendCreateMail', sendMailLimiter, sendCreateMail)

router.get('/sendForgotMail', sendMailLimiter, sendForgotMail)

router.post('/resetPassword', getTokenId, resetPassword, addLog)

export default router
