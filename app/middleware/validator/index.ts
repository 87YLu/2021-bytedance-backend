import Koa from 'koa'
import check from './check'
import { IParams, IRules } from './types'

export default function (app: Koa) {
  app.context.verifyParams = function (rules: IRules) {
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
}
