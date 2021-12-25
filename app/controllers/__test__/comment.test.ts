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

describe('comment', () => {
  describe('add', () => {
    it('should be able to offered commentaries on the news', async function () {
      const res = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '61aca353c646240c0bd29d06', content: '1', type: 1 })

      expect(res.body.success).to.be.true
    })

    it('should be failed when newsId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '1', content: '1', type: 1 })

      const res2 = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '61ab2a606daa914b53fdd07c', content: '1', type: 1 })

      expect(res1.body.message).to.be.equal('新闻不存在')
      expect(res2.body.message).to.be.equal('新闻不存在')
    })

    it('should be able to offered commentaries on the comments', async function () {
      const res = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '61bdf90eed9fbca130337948', content: '1', type: 2 })

      expect(res.body.success).to.be.true
    })

    it('should be failed when commentId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '1', content: '1', type: 2 })

      const res2 = await request(app.listen())
        .post('/api/comment/add')
        .set('Authorization', token)
        .send({ id: '61ab2a606daa914b53fdd07c', content: '1', type: 2 })

      expect(res1.body.message).to.be.equal('评论不存在')
      expect(res2.body.message).to.be.equal('评论不存在')
    })
  })

  describe('delete', () => {
    it('should be able to delete comment correctly', async function () {
      const res = await request(app.listen())
        .post('/api/comment/delete')
        .set('Authorization', token)
        .send({ id: '61bebdffec79aa4e33cb6bda' })

      expect(res.body.success).to.be.true
    })

    it("should fail to delete other people's comments", async function () {
      const res = await request(app.listen())
        .post('/api/comment/delete')
        .set('Authorization', token)
        .send({ id: '61bdf950ed9fbca130337952' })

      expect(res.body.message).to.be.equal('没有权限执行此操作')
    })

    it('should be failed when commentId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/comment/delete')
        .set('Authorization', token)
        .send({ id: '1' })

      const res2 = await request(app.listen())
        .post('/api/comment/delete')
        .set('Authorization', token)
        .send({ id: '61bebdffec79aa4e33cb6bda' })

      expect(res1.body.message).to.be.equal('评论不存在')
      expect(res2.body.message).to.be.equal('评论不存在')
    })
  })

  describe('getMyComments', () => {
    it('should be able to get my comment correctly', async function () {
      const res1 = await request(app.listen())
        .get('/api/comment/getMyComments?size=1&current=1')
        .set('Authorization', token)

      const res2 = await request(app.listen())
        .get('/api/comment/getMyComments?size=1&current=4')
        .set('Authorization', token)

      const res3 = await request(app.listen())
        .get('/api/comment/getMyComments')
        .set('Authorization', token)

      expect(res1.body.success).to.be.true
      expect(res1.body.data.records.length).to.be.equal(1)
      expect(res1.body.data.total).to.be.equal(5)
      expect(res2.body.success).to.be.true
      expect(res2.body.data.records.length).to.be.equal(1)
      expect(res2.body.data.total).to.be.equal(5)
      expect(res3.body.success).to.be.true
    })
  })

  describe('getComments', () => {
    it("should be able to get news's comment correctly", async function () {
      const res = await request(app.listen())
        .get(
          '/api/comment/getComments?size=10&current=1&type=1&orderBy=1&id=61aca351c646240c0bd28f52',
        )
        .set('Authorization', token)
      const { records, total } = res.body.data

      const { isMine, isLike, likesNum, followNum } = records[1]

      expect(total).to.be.equal(2)
      expect(isMine).to.be.true
      expect(isLike).to.be.true
      expect(likesNum).to.be.equal(1)
      expect(followNum).to.be.equal(2)
    })

    it("should be able to get comment's comment correctly", async function () {
      const res = await request(app.listen())
        .get(
          '/api/comment/getComments?size=10&current=1&type=2&orderBy=2&id=61bdf90eed9fbca130337948',
        )
        .set('Authorization', token)

      const { records, total } = res.body.data

      expect(total).to.be.equal(2)
      expect(records[1].likesNum).to.lessThan(records[0].likesNum)
    })
  })
})
