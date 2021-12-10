import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { DefaultContext, Next } from 'koa'
import { User } from '@models'
import { secret } from '@db'
import { success, createVerification, sendVerificationEmail, checkVerification } from './utils'

const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

class UserCtl {
  /**
   * 发送创建用户的邮件
   */
  async sendCreateMail(ctx: DefaultContext) {
    ctx.verifyParams({
      email: { type: 'string', required: true, pattern: emailRegex },
    })

    const { email } = ctx.request.query

    const repeatedUser = await User.findOne({ email })

    if (repeatedUser) {
      ctx.throw(409, '用户已经存在')
    }

    const code = await createVerification({
      email,
      type: 1,
    })

    await sendVerificationEmail({
      to: email,
      subject: '创建用户',
      verification: code,
    })

    ctx.body = success()
  }

  /**
   * 发送忘记密码的邮件
   */
  async sendForgotMail(ctx: DefaultContext) {
    ctx.verifyParams({
      email: { type: 'string', required: true, pattern: emailRegex },
    })

    const { email } = ctx.request.query

    const code = await createVerification({
      email,
      type: 2,
    })

    await sendVerificationEmail({
      to: email,
      subject: '重置密码',
      verification: code,
    })

    ctx.body = success()
  }

  /**
   * 用户注册
   */
  async create(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      name: { type: 'string', required: true, minLength: 1, maxLength: 10 },
      email: { type: 'string', required: true, pattern: emailRegex },
      password: { type: 'string', required: true, minLength: 3 },
      verifyCode: { type: 'string', required: true, minLength: 6, maxLength: 6 },
    })

    const { email, password, name, verifyCode } = ctx.request.body
    const repeatedUser = await User.findOne({ email })

    if (repeatedUser) {
      ctx.throw(409, '用户已经存在')
    }

    const passed = await checkVerification({ email, code: verifyCode, type: 1 })

    if (passed === false) {
      ctx.throw(401, '验证码错误')
    }

    const salt = bcrypt.genSaltSync(10)
    const psw = bcrypt.hashSync(password, salt)
    const userMsg = {
      name,
      email,
      password: psw,
      avatar: `${ctx.origin}/origins/origin_avatar.png`,
    }
    await new User(userMsg).save()
    ctx.body = success()

    await next()
  }

  /**
   * 用户登录
   */
  async login(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      email: { type: 'string', required: true, pattern: emailRegex },
      password: { type: ['string', 'number'], required: true },
    })
    const { email, password } = ctx.request.body
    const user = await User.findOne({ email }).select('+password')

    if (user == null) {
      ctx.throw(401, '用户或密码错误')
      return
    }

    const correct = bcrypt.compareSync(password, user.password)

    if (correct === false) {
      ctx.throw(401, '用户或密码错误')
    }

    const { _id } = user
    const token = jsonwebtoken.sign({ _id, email }, secret, { expiresIn: '1d' })

    ctx.body = success({
      token,
      expireAt: moment().add(1, 'day').valueOf(),
      user: {
        email: user.email,
        avatar: user.avatar,
        name: user.name,
      },
    })

    ctx.userId = _id

    await next()
  }

  /**
   * 修改头像
   */
  async updateAvatar(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      file: { required: true, type: 'file', fileType: 'image', maxSize: 10 * 1024 * 1024 },
    })

    const { file } = ctx.request.files
    const reader = fs.createReadStream(file.path)
    const basename = path.basename(file.path)
    const filePath = path.join(__dirname, '../public/uploads/') + `/${basename}`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)

    const res = `${ctx.origin}/uploads/${basename}`

    await User.findById(ctx.userId).update({ avatar: res })

    ctx.body = success({ avatar: res })

    await next()
  }

  /**
   * 修改密码
   */
  async updatePassword(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      oldPassword: { type: ['string', 'number'], required: true, minLength: 3 },
      newPassword: { type: ['string', 'number'], required: true, minLength: 3 },
    })

    const { oldPassword, newPassword } = ctx.request.body
    const user = (await User.findById(ctx.userId).select('+password'))!
    const correct = bcrypt.compareSync(oldPassword, user.password)
    const salt = bcrypt.genSaltSync(10)
    const psw = bcrypt.hashSync(newPassword, salt)

    if (correct === false) {
      ctx.throw(400, '旧密码不正确')
    }

    if (oldPassword === newPassword) {
      ctx.throw(400, '旧密码不能与新密码相同')
    }

    await user.update({ password: psw })
    ctx.body = success()

    await next()
  }

  /**
   * 重置密码
   */
  async resetPassword(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      newPassword: { type: 'string', required: true, minLength: 3 },
      verifyCode: { type: 'string', required: true, minLength: 6, maxLength: 6 },
    })

    const { newPassword, verifyCode } = ctx.request.body

    const passed = await checkVerification({ email: ctx.email, code: verifyCode, type: 2 })

    if (passed === false) {
      ctx.throw(401, '验证码错误')
    }

    const salt = bcrypt.genSaltSync(10)
    const psw = bcrypt.hashSync(newPassword, salt)

    await User.findById(ctx.userId).update({ password: psw })

    ctx.body = success()

    await next()
  }
}

export default new UserCtl()
