import Koa from 'koa'
import check from './check'
import { IParams, IRules } from './types'

export default function (app: Koa) {
  app.context.verifyParams = function (rules: IRules) {
    if (rules == null) {
      return
    }

    let params: IParams

    params = ['GET', 'HEAD'].includes(this.method.toUpperCase())
      ? this.request.query
      : this.request.body

    params = Object.assign({}, params, this.params)

    if (this.request.files) {
      Object.keys(this.request.files).forEach(key => {
        params[key] = this.request.files[key]
      })
    }

    const error: string | undefined = check(params, rules)

    if (error == null) {
      return
    }

    this.throw(422, error)
  }

  return async function verifyParam(ctx: Koa.DefaultContext, next: Koa.Next) {
    try {
      await next()
    } catch (err) {
      if (err) {
        ctx.throw(422, err)
      }
      throw err
    }
  }
}
