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

describe('like', () => {
  describe('add', () => {
    it('should be able to add correctly', async function () {
      const res = await request(app.listen())
        .post('/api/like/add')
        .set('Authorization', token)
        .send({ commentId: '61beca19bf6c7c927dbc92cb' })

      expect(res.body.success).to.be.true
    })

    it('should be failed when repeating', async function () {
      const res = await request(app.listen())
        .post('/api/like/add')
        .set('Authorization', token)
        .send({ commentId: '61beca19bf6c7c927dbc92cb' })

      expect(res.body.message).to.be.equal('请勿重复点赞')
    })

    it('should be failed when commentId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/like/add')
        .set('Authorization', token)
        .send({ commentId: '1' })

      const res2 = await request(app.listen())
        .post('/api/like/add')
        .set('Authorization', token)
        .send({ commentId: '61ab2a606daa914b53fdd07c' })

      expect(res1.body.message).to.be.equal('找不到评论主体')
      expect(res2.body.message).to.be.equal('找不到评论主体')
    })
  })

  describe('delete', () => {
    it('should be able to delete correctly', async function () {
      const res = await request(app.listen())
        .post('/api/like/delete')
        .set('Authorization', token)
        .send({ commentId: '61beca19bf6c7c927dbc92cb' })

      expect(res.body.success).to.be.true
    })

    it('should be failed when repeating', async function () {
      const res = await request(app.listen())
        .post('/api/like/delete')
        .set('Authorization', token)
        .send({ commentId: '61beca19bf6c7c927dbc92cb' })

      expect(res.body.message).to.be.equal('请勿重复取消点赞')
    })

    it('should be failed when commentId is wrong', async function () {
      const res1 = await request(app.listen())
        .post('/api/like/delete')
        .set('Authorization', token)
        .send({ commentId: '1' })

      const res2 = await request(app.listen())
        .post('/api/like/delete')
        .set('Authorization', token)
        .send({ commentId: '61ab2a606daa914b53fdd07c' })

      expect(res1.body.message).to.be.equal('找不到评论主体')
      expect(res2.body.message).to.be.equal('找不到评论主体')
    })
  })

  describe('getMyLikes', () => {
    it('should be able to get my likes correctly', async function () {
      const res = await request(app.listen())
        .get('/api/like/getMyLikes')
        .set('Authorization', token)

      expect(res.body.success).to.be.true
      expect(res.body.data.total).to.be.equal(2)
    })
  })
})
