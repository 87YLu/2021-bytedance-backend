import { DefaultContext, Next } from 'koa'
import { Collection, News } from '@models'
import { success, getCorrectTime, paging } from './utils'

class CollectionCtl {
  /**
   * 添加收藏
   */
  async add(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      newsId: {
        type: 'string',
        required: true,
      },
    })

    const { newsId } = ctx.request.body

    let targetNews

    try {
      targetNews = await News.findById(newsId)
    } catch (e) {
      ctx.throw(401, '找不到新闻主体')
      return
    }

    if (targetNews == null) {
      ctx.throw(401, '找不到新闻主体')
    }

    const exist = await Collection.findOne({ userId: ctx.userId, newsId })

    if (exist) {
      ctx.throw(401, '请勿重复收藏')
    }

    await new Collection({
      userId: ctx.userId,
      newsId: targetNews!._id,
    }).save()

    ctx.body = success()

    await next()
  }

  /**
   * 取消收藏
   */
  async delete(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      newsId: {
        type: 'string',
        required: true,
      },
    })

    const { newsId } = ctx.request.body

    let targetNews

    try {
      targetNews = await News.findById(newsId)
    } catch (e) {
      ctx.throw(401, '找不到新闻主体')
    }

    if (targetNews == null) {
      ctx.throw(401, '找不到新闻主体')
    }

    const exist = await Collection.findOne({ userId: ctx.userId, newsId })

    if (exist != null) {
      ctx.throw(401, '请勿重复取消收藏')
    }

    await Collection.findOneAndRemove({
      userId: ctx.userId,
      newsId,
    })

    ctx.body = success()

    await next()
  }

  /**
   * 获取我的收藏
   */
  async getMyCollections(ctx: DefaultContext, next: Next) {
    const { size, current } = ctx.query
    const { skip, limit } = paging(size, current)

    const total = await Collection.count({ userId: ctx.userId })
    const temp = await Collection.find({ userId: ctx.userId })
      .select('+digest')
      .populate({ path: 'newsId', select: '+digest' })
      .skip(skip)
      .limit(limit)

    const res = temp.map(item => {
      const { _id, newsId: news, createdAt } = item
      const { _id: newsId, title, digest, publishTime, source } = news as any
      return { _id, newsId, title, digest, publishTime, source, time: getCorrectTime(createdAt) }
    })

    ctx.body = success({ records: res, total })

    await next()
  }
}

export default new CollectionCtl()
