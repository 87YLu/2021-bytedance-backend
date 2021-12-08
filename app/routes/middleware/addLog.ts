import { DefaultContext } from 'koa'
import { Log } from '@models'

const addLog = async (ctx: DefaultContext) => {
  let params = ['GET', 'HEAD'].includes(ctx.method.toUpperCase())
    ? ctx.request.query
    : ctx.request.body

  params = Object.assign({}, params)

  delete params.password
  delete params.oldPassword
  delete params.newPassword

  await new Log({
    userId: ctx.userId,
    api: ctx.request.url.replace(/\?.*$/, ''),
    params,
  }).save()
}

export default addLog
