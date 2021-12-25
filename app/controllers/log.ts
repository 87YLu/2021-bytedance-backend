import { Context } from 'koa'
import moment from 'moment'
import { Log, News, NewsType } from '@models'
import { getCorrectTime } from './utils'

class LogCtl {
  async getMyLogs(ctx: Context) {
    ctx.verifyParams({
      type: { type: ['string', 'number'], required: true, min: 1, max: 2 },
    })

    const { type } = ctx.query

    const $gte =
      Number(type) === 1
        ? moment().subtract(7, 'days').format('YYYY-MM-DD')
        : moment().subtract(1, 'months').format('YYYY-MM-DD')

    const actions = await Log.find({ userId: ctx.userId, createdAt: { $gte, $lte: Date.now() } })
    const newsType = await NewsType.find()
    const maxTypeId = Math.max(...newsType.map(item => item.typeId))

    const useTimeTimes = new Array(24).fill(0)
    const viewNewsId: string[] = []

    actions.forEach(item => {
      if (item.api === '/api/news/getNewsItem') {
        viewNewsId.push(item.params.id)
      }

      const time = Number(getCorrectTime(item.createdAt as Date, 'HH'))
      useTimeTimes[time] += 1
    })

    const viewNews = await News.find({ _id: { $in: viewNewsId } }).select('type')
    const newsTypeMap: { [key: string]: number } = {}

    viewNews.forEach(item => {
      newsTypeMap[item._id] = item.type
    })

    const typeTimes = new Array(maxTypeId + 1).fill(0)
    typeTimes[0] = null

    viewNewsId.forEach(newsId => {
      typeTimes[newsTypeMap[newsId]] += 1
    })

    ctx.success({
      useTimeTimes,
      typeTimes,
    })
  }
}

export default new LogCtl()
