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

describe('collection', () => {
  describe('add', () => {
    it('should be able to add correctly', async function () {
      const res = await request(app.listen())
        .post('/api/collection/add')
        .set('Authorization', token)
        .send({
          newsId: '61aca351c646240c0bd28f52',
        })

      expect(res.body.success).to.be.true
    })

    it('should be failed when repeating', async function () {
      const res = await request(app.listen())
        .post('/api/collection/add')
        .set('Authorization', token)
        .send({
          newsId: '61aca351c646240c0bd28f52',
        })

      expect(res.body.message).to.be.equal('请勿重复收藏')
    })

    it('should be failed when newsId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/collection/add')
        .set('Authorization', token)
        .send({
          newsId: '1',
        })

      const res2 = await request(app.listen())
        .post('/api/collection/add')
        .set('Authorization', token)
        .send({
          newsId: '61ab2a606daa914b53fdd07c',
        })

      expect(res1.body.message).to.be.equal('找不到新闻主体')
      expect(res2.body.message).to.be.equal('找不到新闻主体')
    })
  })

  describe('delete', () => {
    it('should be able to delete correctly', async function () {
      const res = await request(app.listen())
        .post('/api/collection/delete')
        .set('Authorization', token)
        .send({
          newsId: '61aca351c646240c0bd28f52',
        })

      expect(res.body.success).to.be.true
    })

    it('should be failed when repeating', async function () {
      const res = await request(app.listen())
        .post('/api/collection/delete')
        .set('Authorization', token)
        .send({
          newsId: '61aca351c646240c0bd28f52',
        })

      expect(res.body.message).to.be.equal('请勿重复取消收藏')
    })

    it('should be failed when newsId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/collection/delete')
        .set('Authorization', token)
        .send({
          newsId: '1',
        })

      const res2 = await request(app.listen())
        .post('/api/collection/delete')
        .set('Authorization', token)
        .send({
          newsId: '61ab2a606daa914b53fdd07c',
        })

      expect(res1.body.message).to.be.equal('找不到新闻主体')
      expect(res2.body.message).to.be.equal('找不到新闻主体')
    })
  })

  describe('getMyCollections', () => {
    it('should be able to get my collections correctly', async function () {
      const res1 = await request(app.listen())
        .get('/api/collection/getMyCollections')
        .set('Authorization', token)

      await request(app.listen()).post('/api/collection/add').set('Authorization', token).send({
        newsId: '61aca351c646240c0bd28f52',
      })

      const res2 = await request(app.listen())
      .get('/api/collection/getMyCollections')
      .set('Authorization', token)

      expect(res1.body.success).to.be.true
      expect(res1.body.data.total).to.be.equal(0)
      expect(res2.body.success).to.be.true
      expect(res2.body.data.total).to.be.equal(1)
      expect(res2.body.data.records[0].newsId).to.be.equal('61aca351c646240c0bd28f52')
    })
  })
})
