import { Context, Next } from 'koa'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '@db'
import { IJwtDecodeMsg } from './types'

const getTokenID = async (ctx: Context, next: Next) => {
  const { authorization } = ctx.headers
  jsonwebtoken.verify(authorization!, secret)
  const msg = jsonwebtoken.decode(authorization!)

  ctx.userId = (msg as IJwtDecodeMsg)._id
  ctx.email = (msg as IJwtDecodeMsg).email

  await next()
}

export default getTokenID
