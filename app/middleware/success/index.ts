import Koa from 'koa'

export default function (app: Koa) {
  app.context.success = function (data?: any) {
    this.body = {
      message: 'success',
      status: 200,
      success: true,
      data,
    }
  }
}
