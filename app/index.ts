import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import error from 'koa-json-error'
import path from 'path'
import router from '@routes'
import { validator, success } from './middleware'

const app = new Koa()

const MILLSECONDS_IN_1_YEAR = 1000 * 60 * 60 * 24 * 365

app.use(
  koaStatic(path.join(process.cwd(), './public'), {
    maxage: MILLSECONDS_IN_1_YEAR,
  }),
)

app.use(
  error({
    postFormat: (_, { stack, ...rest }) => {
      // 如果处于 生产模式 的话，出于安全考虑就不暴露出错误堆栈
      return process.env.NODE_ENV === 'production'
        ? { ...rest, success: false }
        : {
            stack,
            ...rest,
            success: false,
          }
    },
  }),
)

app.use(
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
    },
  }),
)

validator(app)

success(app)

app.use(router.routes())

export default app
