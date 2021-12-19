/* eslint-disable no-unused-expressions */
import request from 'supertest'
import { expect } from 'chai'
import app from '@app'

let token: string

before(async () => {
  const res = await request(app.listen()).post('/api/user/login').send({
    email: '8@qq.com',
    password: '123',
  })
  token = res.body.data.token
})

describe('_log', () => {
  describe('getMyLogs', () => {
    it('should be able to get my logs correctly', async function () {
      const res1 = await request(app.listen())
        .get('/api/log/getMyLogs?type=1')
        .set('Authorization', token)

      const res2 = await request(app.listen())
        .get('/api/log/getMyLogs?type=2')
        .set('Authorization', token)

      const { useTimeTimes: day1, typeTimes: day2 } = res1.body.data
      const { useTimeTimes: month1, typeTimes: month2 } = res2.body.data
      const day1Target = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0]
      const day2Target = [null, 0, 3, 1, 0, 1, 1, 0]
      const month1Target = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0]
      const month2Target = [null, 0, 3, 2, 0, 4, 1, 0]

      expect(day1).to.deep.equal(day1Target)
      expect(day2).to.deep.equal(day2Target)
      expect(month1).to.deep.equal(month1Target)
      expect(month2).to.deep.equal(month2Target)
    })
  })
})
