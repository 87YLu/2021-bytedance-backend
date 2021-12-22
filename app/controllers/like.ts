import { Context, Next } from 'koa'
import { Like, Comment, User } from '@models'
import { paging, getCorrectTime } from './utils'

class LikeCtl {
  /**
   * 添加点赞
   */
  async add(ctx: Context, next: Next) {
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
      ctx.throw(401, '请勿重复点赞')
    }

    await new Like({
      userId: ctx.userId,
      commentId,
    }).save()

    ctx.success()

    await next()
  }

  /**
   * 取消点赞
   */
  async delete(ctx: Context, next: Next) {
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

    if (exist == null) {
      ctx.throw(401, '请勿重复取消点赞')
    }

    await Like.findOneAndRemove({
      userId: ctx.userId,
      commentId,
    })

    ctx.success()

    await next()
  }

  /**
   * 分页获取我的点赞
   */
  async getMyLikes(ctx: Context, next: Next) {
    const { size, current } = ctx.query
    const { skip, limit } = paging(size as string | undefined, current as string | undefined)

    const temp = await Like.find({ userId: ctx.userId })
      .sort('-createdAt')
      .populate('commentId')
      .skip(skip)
      .limit(limit)
    const total = await Like.count({ userId: ctx.userId })
    const resPromise = temp.map(item => {
      const { _id, commentId: comment, createdAt } = item
      const { newsId, content, _id: commentId, userId: targetUserId } = comment as any

      return new Promise(resolve => {
        User.findById(targetUserId).then(res => {
          resolve({
            _id,
            commentId,
            userName: res!.name,
            userAvatar: res!.avatar,
            newsId,
            content,
            time: getCorrectTime(createdAt),
          })
        })
      })
    })
    const res = []

    for await (const data of resPromise) {
      res.push(data)
    }

    ctx.success({ records: res, total })

    await next()
  }
}

export default new LikeCtl()
