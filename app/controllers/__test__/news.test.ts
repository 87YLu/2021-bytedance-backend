/* eslint-disable no-unused-expressions */
import request from 'supertest'
import { expect } from 'chai'
import app from '@app'

let token: string

before(async () => {
  const res = await request(app.listen()).post('/api/user/login').send({
    email: '1790599287@qq.com',
    password: '123',
  })
  token = res.body.data.token
})

describe('news', () => {
  describe('getNewsItem', () => {
    it('should be failed when id is wrong', async function () {
      const res1 = await request(app.listen())
        .get('/api/news/getNewsItem?id=1')
        .set('Authorization', token)

      const res2 = await request(app.listen())
        .get('/api/news/getNewsItem?id=61ab2a606daa914b53fdd07c')
        .set('Authorization', token)

      expect(res1.body.message).to.be.equal('找不到新闻主体')
      expect(res2.body.message).to.be.equal('找不到新闻主体')
    })

    it('should be able to get news item correctly', async function () {
      const res = await request(app.listen())
        .get('/api/news/getNewsItem?id=61aca351c646240c0bd28f52')
        .set('Authorization', token)
      expect(res.body.success).to.be.true
      expect(res.body.data._id).to.be.equal('61aca351c646240c0bd28f52')
    })
  })

  describe('getNewsDigest', () => {
    it('should be able to get news digest correctly', async function () {
      const res = await request(app.listen())
        .get('/api/news/getNewsDigest?type=2')
        .set('Authorization', token)

      expect(res.body.data.records.length).to.be.equal(3)
      expect(res.body.success).to.be.true
    })
  })

  describe('getNewsType', () => {
    it('should be able to get news types correctly', async function () {
      const res = await request(app.listen()).get('/api/news/getNewsType')

      expect(res.body.success).to.be.true
    })
  })
})
