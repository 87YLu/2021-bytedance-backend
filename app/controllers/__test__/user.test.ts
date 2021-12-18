import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { expect } from 'chai'
import { User } from '@models'
import app from '@app'

let mongoServer: any

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)

  await new User({ name: '123', email: '123@qq.com', password: '123' }).save()
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('ceshi', () => {
  it('ceshi1', done => {
    request(app.listen())
      .post('/api/user/login')
      .send({
        email: '123@qq.com',
        password: '123',
      })
      .end((_err, res) => {
        expect(res.body.message).to.equal('用户或密码错误')
        done()
      })
  })
})
