import { DefaultContext, Next } from 'koa'
import { News, NewsType, Collection } from '@models'
import { success, paging } from './utils'

class NewsDigestCtl {
  /**
   * 获取新闻主体
   */
  async getNewsItem(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })

    const { id } = ctx.query
    let targetNews

    try {
      targetNews = await News.findById(id).select('+content')
    } catch (err) {
      ctx.throw(401, '找不到新闻主体')
    }

    if (targetNews == null) {
      ctx.throw(401, '找不到新闻主体')
      return
    }

    const isCollection = (await Collection.findOne({ userId: ctx.userId, newsId: id })) != null
    const { _id, title, content, publishTime, source } = targetNews

    ctx.body = success({ _id, title, content, publishTime, source, isCollection })

    await next()
  }

  /**
   * 分页获取新闻摘要
   */
  async getNewsDigest(ctx: DefaultContext, next: Next) {
    const { size, current, type } = ctx.query
    const { skip, limit } = paging(size, current)

    const total = await News.count({ type: Number(type) })
    const news = await News.find({ type: Number(type) })
      .select('+digest')
      .select('+img')
      .sort('-publishTime')
      .skip(skip)
      .limit(limit)

    ctx.body = success({ records: news, total })

    await next()
  }

  /**
   * 获取新闻类型
   */
  async getNewsType(ctx: DefaultContext) {
    const temp = await NewsType.find()

    const res = temp.map(item => ({
      id: item.typeId,
      name: item.typeName,
    }))

    ctx.body = success(res)
  }
}

export default new NewsDigestCtl()
