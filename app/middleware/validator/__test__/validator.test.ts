/* eslint-disable no-unused-expressions */
import Koa from 'koa'
import request from 'supertest'
import { expect } from 'chai'
import Router from 'koa-router'
import path from 'path'
import app from '@app'

const router = new Router()

router.get('/', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    a: { type: 'string', required: true },
  })
  ctx.body = 200
})

router.get('/a', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    string: { type: 'string', required: true, minLength: 3, maxLength: 6 },
  })
  ctx.body = 200
})

router.get('/b', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    string: { type: 'string', required: true, min: 3, max: 6 },
  })
  ctx.body = 200
})

router.get('/c', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    string: {
      type: 'string',
      required: true,
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    },
  })
  ctx.body = 200
})

router.get('/d', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    string: { type: 'string' },
  })
  ctx.body = 200
})

router.post('/e', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    number: { type: 'number', required: true, min: 0, max: 10 },
  })
  ctx.body = 200
})

router.post('/f', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    number: { type: 'number' },
  })
  ctx.body = 200
})

router.post('/g', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    file: { type: 'file', maxSize: 0.01 },
  })
  ctx.body = 200
})

router.post('/h', async (ctx: Koa.Context) => {
  ctx.verifyParams({
    file: { type: 'file', fileType: 'text' },
  })
  ctx.body = 200
})

app.use(router.routes())

describe('validator', () => {
  it('should check require correctly', async function () {
    const res1 = await request(app.listen()).get('/')
    const res2 = await request(app.listen()).get('/?a=1')
    expect(res1.body.message).to.equal('a 是必传参数')
    expect(res2.body).to.equal(200)
  })

  describe('string', () => {
    it('should check length correctly', async function () {
      const res1 = await request(app.listen()).get('/a?string=a')
      const res2 = await request(app.listen()).get('/a?string=abcdefg')
      const res3 = await request(app.listen()).get('/a?string=abc')
      const res4 = await request(app.listen()).get('/a?string=abcdef')
      expect(res1.body.message).to.equal('string 的长度必须大于或等于 3')
      expect(res2.body.message).to.equal('string 的长度必须小于或等于 6')
      expect(res3.body).to.equal(200)
      expect(res4.body).to.equal(200)
    })

    it('should check size correctly', async function () {
      const res1 = await request(app.listen()).get('/b?string=1')
      const res2 = await request(app.listen()).get('/b?string=7')
      const res3 = await request(app.listen()).get('/b?string=3')
      const res4 = await request(app.listen()).get('/b?string=6')
      const res5 = await request(app.listen()).get('/b?string=ascasc')
      expect(res1.body.message).to.equal('参数 string 必须大于或等于 3')
      expect(res2.body.message).to.equal('参数 string 必须小于或等于 6')
      expect(res3.body).to.equal(200)
      expect(res4.body).to.equal(200)
      expect(res5.body.message).to.equal('参数 string 的格式错误')
    })

    it('should check pattern correctly', async function () {
      const res1 = await request(app.listen()).get('/c?string=1')
      const res2 = await request(app.listen()).get('/c?string=1@qq.com')
      expect(res1.body.message).to.equal('参数 string 的格式错误')
      expect(res2.body).to.equal(200)
    })

    it('should check type correctly', async function () {
      const res1 = await request(app.listen()).get('/d?string=1&string=2')
      const res2 = await request(app.listen()).get('/d?string=1@qq.com')
      const res3 = await request(app.listen()).get('/d')
      expect(res1.body.message).to.equal('string 的类型不正确')
      expect(res2.body).to.equal(200)
      expect(res3.body).to.equal(200)
    })
  })

  describe('number', () => {
    it('should check size correctly', async function () {
      const res1 = await request(app.listen()).post('/e').send({ number: -1 })
      const res2 = await request(app.listen()).post('/e').send({ number: 11 })
      const res3 = await request(app.listen()).post('/e').send({ number: 0 })
      const res4 = await request(app.listen()).post('/e').send({ number: 10 })
      expect(res1.body.message).to.equal('参数 number 必须大于或等于 0')
      expect(res2.body.message).to.equal('参数 number 必须小于或等于 10')
      expect(res3.body).to.equal(200)
      expect(res4.body).to.equal(200)
    })

    it('should check type correctly', async function () {
      const res1 = await request(app.listen()).post('/f').send({ number: '-1' })
      const res2 = await request(app.listen()).post('/f').send({ number: 1 })
      const res3 = await request(app.listen()).post('/f')
      expect(res1.body.message).to.equal('number 的类型不正确')
      expect(res2.body).to.equal(200)
      expect(res3.body).to.equal(200)
    })
  })

  describe('file', () => {
    it('should check size correctly', async function () {
      const res1 = await request(app.listen())
        .post('/g')
        .type('form')
        .attach('file', path.join(__dirname, './test.txt'))
      const res2 = await request(app.listen())
        .post('/g')
        .type('form')
        .attach('file', path.join(__dirname, './test.jpg'))

      expect(res1.body.message).to.equal('file 大小不能为空')
      expect(res2.body.message).to.equal('file 最大支持0MB')
    })

    it('should check type correctly', async function () {
      const res1 = await request(app.listen()).post('/h').send({ file: 1 })
      const res2 = await request(app.listen()).post('/h').send()
      const res3 = await request(app.listen())
        .post('/h')
        .type('form')
        .attach('file', path.join(__dirname, './test.jpg'))

      const res4 = await request(app.listen())
        .post('/h')
        .type('form')
        .attach('file', path.join(__dirname, './test1.txt'))

      expect(res1.body.message).to.equal('file 的类型不正确')
      expect(res2.body).to.equal(200)
      expect(res3.body.message).to.equal('file 的文件类型错误')
      expect(res4.body).to.equal(200)
    })
  })
})
