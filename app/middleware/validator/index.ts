import Koa from 'koa'
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

    const keys = Object.keys(rules)
    let errors

    for (const key of keys) {
      const param = params[key]
      const { required = false, type, minLength, maxLength, min, max, pattern } = rules[key]

      if (param == null) {
        if (required) {
          errors = `${key} 是必传参数`
          break
        }

        break
      }

      if (type) {
        const paramType = Object.prototype.toString.call(param).slice(8, -1).toLowerCase()
        const flag = Array.isArray(type) ? type.includes(paramType) : type === paramType

        if (flag === false) {
          errors = `参数 ${key} 的类型不正确`
          break
        }
      }

      if (typeof param === 'string') {
        const length = param.length

        if (minLength && minLength > length) {
          errors = `参数 ${key} 的长度必须大于或等于 ${minLength}`
          break
        }

        if (maxLength && maxLength < length) {
          errors = `参数 ${key} 的长度必须小于或等于 ${maxLength}`
          break
        }

        if (pattern && pattern.test(param) === false) {
          errors = `参数 ${key} 的格式错误`
          break
        }
      }

      if (['number', 'string'].includes(typeof param)) {
        if (min && min > Number(param)) {
          errors = `参数 ${key} 必须大于或等于 ${min}`
          break
        }

        if (max && max < Number(param)) {
          errors = `参数 ${key} 必须小于或等于 ${max}`
          break
        }
      }
    }

    if (errors == null) {
      return
    }

    this.throw(422, errors)
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
