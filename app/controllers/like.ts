import { DefaultContext, Next } from 'koa'
import { Like, Comment } from '@models'
import { success, paging } from './utils'

class LikeCtl {
  /**
   * 添加点赞
   */
  async add(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      commentId: { type: 'string', required: true },
    })

    const { commentId } = ctx.request.body

    let targetComment

    try {
      targetComment = await Comment.findById(commentId)
    } catch (e) {
      ctx.throw(401, '找不到评论主体')
    }

    if (targetComment == null) {
      ctx.throw(401, '找不到评论主体')
    }

    const exist = await Like.findOne({ userId: ctx.userId, commentId })

    if (exist) {
      ctx.throw(401, '请勿重复点赞')
    }

    await new Like({
      userId: ctx.userId,
      commentId,
    }).save()

    ctx.body = success()

    await next()
  }

  /**
   * 取消点赞
   */
  async delete(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      commentId: { type: 'string', required: true },
    })

    const { commentId } = ctx.request.body

    let targetComment

    try {
      targetComment = await Comment.findById(commentId)
    } catch (e) {
      ctx.throw(401, '找不到评论主体')
    }

    if (targetComment == null) {
      ctx.throw(401, '找不到评论主体')
    }

    const exist = await Like.findOne({ userId: ctx.userId, commentId })

    if (exist != null) {
      ctx.throw(401, '请勿重复取消点赞')
    }

    await Like.findOneAndRemove({
      userId: ctx.userId,
      commentId,
    })

    ctx.body = success()

    await next()
  }

  /**
   * 分页获取我的点赞
   */
  async getMyLikes(ctx: DefaultContext, next: Next) {
    const { size, current } = ctx.query
    const { skip, limit } = paging(size, current)

    const temp = await Like.find({ userId: ctx.userId })
      .populate('commentId')
      .skip(skip)
      .limit(limit)
    const total = await Like.count({ userId: ctx.userId })

    const res = temp.map(item => {
      const { _id, commentId: comment } = item
      const { newsId, content, _id: commentId } = comment as any
      return { _id, commentId, newsId, content }
    })

    ctx.body = success({ records: res, total })

    await next()
  }
}

export default new LikeCtl()
