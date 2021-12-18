import { Context, Next } from 'koa'
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

const sendMailLimiter =
  process.env.NODE_ENV === 'production'
    ? RateLimit.middleware({
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
    : async (ctx: Context, next: Next) => {
        await next()
      }

router.post('/create', create, addLog)

router.post('/login', login, addLog)

router.post('/updateAvatar', getTokenId, updateAvatar, addLog)

router.post('/updatePassword', getTokenId, updatePassword, addLog)

router.get('/sendCreateMail', sendMailLimiter, sendCreateMail)

router.get('/sendForgotMail', sendMailLimiter, sendForgotMail)

router.post('/resetPassword', resetPassword)

export default router
