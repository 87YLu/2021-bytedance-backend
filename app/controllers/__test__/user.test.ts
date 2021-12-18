/* eslint-disable no-unused-expressions */
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import { User, VerifyCode } from '@models'
import app from '@app'

let mongoServer: any

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
  await new User({
    _id: '61ab2a606daa914b53fdd07c',
    __v: '0',
    avatar: 'http://localhost:8877/uploads/830e90b544c6930738b84617678734e51639484690825.jpg',
    email: '934851346@qq.com',
    name: 'cyc',
    password: '$2a$10$kXwZqt8hRLnkrdoy26NAzeVNrmQZ50I/1jNXbhGTcTCml8freh0Ni', // 这是 1234
  }).save()
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

let createCode: string
let forgotCode: string
let token: string

describe('user', () => {
  describe('sendCreateMail', () => {
    it('should be failed when user is existed', async function () {
      const res = await request(app.listen()).get('/api/user/sendCreateMail?email=934851346@qq.com')

      expect(res.body.message).to.equal('用户已经存在')
    })

    it('should be able to send email correctly', async function () {
      const res = await request(app.listen()).get(
        '/api/user/sendCreateMail?email=1790599287ylu@gmail.com',
      )
      const code = await VerifyCode.findOne({ type: 1, email: '1790599287ylu@gmail.com' })
      createCode = code!.code
      expect(res.body.success).to.be.true
      expect(code).not.to.be.null
    })
  })

  describe('sendForgotMail', () => {
    it('should be able to send email correctly', async function () {
      const res = await request(app.listen()).get('/api/user/sendForgotMail?email=934851346@qq.com')
      const code = await VerifyCode.findOne({ type: 2, email: '934851346@qq.com' })
      forgotCode = code!.code
      expect(res.body.success).to.be.true
      expect(code).not.to.be.null
    })
  })

  describe('create', () => {
    it('should be failed when user is existed', async function () {
      const res = await request(app.listen()).post('/api/user/create').send({
        name: 'cyc',
        email: '934851346@qq.com',
        password: '1234',
        verifyCode: createCode,
      })
      expect(res.body.message).to.equal('用户已经存在')
    })

    it('should be failed when verifyCode is wrong', async function () {
      const res = await request(app.listen()).post('/api/user/create').send({
        name: '87YLu',
        email: '1790599287ylu@gmail.com',
        password: '123',
        verifyCode: 'abcdef',
      })
      expect(res.body.message).to.equal('验证码错误')
    })

    it('should be able to create user correctly', async function () {
      const res = await request(app.listen()).post('/api/user/create').send({
        name: '87YLu',
        email: '1790599287ylu@gmail.com',
        password: '123',
        verifyCode: createCode,
      })
      expect(res.body.success).to.be.true
    })
  })

  describe('login', () => {
    it('should be failed when user is not existed', async function () {
      const res = await request(app.listen()).post('/api/user/login').send({
        email: '123@qq.com',
        password: '1234',
      })
      expect(res.body.message).to.equal('用户或密码错误')
    })

    it('should be failed when password is wrong', async function () {
      const res = await request(app.listen()).post('/api/user/login').send({
        email: '934851346@qq.com',
        password: '123',
      })
      expect(res.body.message).to.equal('用户或密码错误')
    })

    it('should be able to login correctly', async function () {
      const res = await request(app.listen()).post('/api/user/login').send({
        email: '934851346@qq.com',
        password: '1234',
      })
      token = res.body.data.token
      expect(res.body.success).to.be.true
    })
  })

  describe('updateAvatar', () => {
    it('should be able to updateAvatar correctly', async function () {
      const res = await request(app.listen())
        .post('/api/user/updateAvatar')
        .set('Authorization', token)
        .type('form')
        .attach('file', path.join(__dirname, './test.jpg'))

      const avatar = res.body.data.avatar

      const loginRes = await request(app.listen()).post('/api/user/login').send({
        email: '934851346@qq.com',
        password: '1234',
      })

      expect(res.body.success).to.be.true
      expect(loginRes.body.data.user.avatar).to.be.equal(avatar)
      fs.unlinkSync(path.join(process.cwd(), `./public/uploads/${avatar.split('/').pop()}`))
    })
  })

  describe('updatePassword', () => {
    it('should be failed when oldPassword is wrong', async function () {
      const res = await request(app.listen())
        .post('/api/user/updatePassword')
        .set('Authorization', token)
        .send({
          oldPassword: '123',
          newPassword: '1234',
        })

      expect(res.body.message).to.equal('旧密码不正确')
    })

    it('should be failed when oldPassword is equal to newPassword', async function () {
      const res = await request(app.listen())
        .post('/api/user/updatePassword')
        .set('Authorization', token)
        .send({
          oldPassword: '1234',
          newPassword: '1234',
        })

      expect(res.body.message).to.equal('旧密码不能与新密码相同')
    })

    it('should be able to updatePassword correctly', async function () {
      const res = await request(app.listen())
        .post('/api/user/updatePassword')
        .set('Authorization', token)
        .send({
          oldPassword: '1234',
          newPassword: '123',
        })

      const loginRes = await request(app.listen()).post('/api/user/login').send({
        email: '934851346@qq.com',
        password: '123',
      })

      expect(res.body.success).to.be.true
      expect(loginRes.body.success).to.be.true
    })
  })

  describe('resetPassword', () => {
    it('should be failed when verifyCode is wrong', async function () {
      const res = await request(app.listen()).post('/api/user/resetPassword').send({
        email: '934851346@qq.com',
        newPassword: '123',
        verifyCode: 'abcdef',
      })
      expect(res.body.message).to.equal('验证码错误')
    })

    it('should be able to reset password user correctly', async function () {
      const res = await request(app.listen()).post('/api/user/resetPassword').send({
        email: '934851346@qq.com',
        newPassword: '12345',
        verifyCode: forgotCode,
      })

      const loginRes = await request(app.listen()).post('/api/user/login').send({
        email: '934851346@qq.com',
        password: '12345',
      })

      expect(res.body.success).to.be.true
      expect(loginRes.body.success).to.be.true
    })
  })
})
