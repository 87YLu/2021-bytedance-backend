import { DefaultContext, Next } from 'koa'
import { Comment, News } from '@models'
import { success, paging, getCorrectTime } from './utils'

class CommentCtl {
  /**
   * 评论评论
   */
  async add(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      type: { type: 'number', required: true, min: 1, max: 2 },
      id: { type: 'string', required: true },
      content: { type: 'string', required: true, maxLength: 200 },
    })

    const { type, id, content } = ctx.request.body

    switch (type) {
      // 添加新闻评论
      case 1: {
        let targetNews

        try {
          targetNews = await News.findById(id)
        } catch (err) {
          ctx.throw(401, '新闻不存在')
        }

        if (targetNews == null) {
          ctx.throw(401, '新闻不存在')
        }

        await new Comment({
          userId: ctx.userId,
          newsId: id,
          content,
          parentId: 'root',
        }).save()

        ctx.body = success()

        break
      }

      // 添加评论的评论
      case 2: {
        let targetComment

        try {
          targetComment = await Comment.findById(id)
        } catch (e) {
          ctx.throw(401, '评论不存在')
        }

        if (targetComment == null) {
          ctx.throw(401, '评论不存在')
          return
        }

        const newComment = await new Comment({
          userId: ctx.userId,
          newsId: targetComment.newsId,
          content,
          parentId: id,
        }).save()

        targetComment.following.push(newComment._id)
        targetComment.save()

        ctx.body = success()

        break
      }
    }

    await next()
  }

  /**
   * 删除评论
   */
  async delete(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })

    const { id } = ctx.request.body

    let targetComment

    try {
      targetComment = await Comment.findById(id)
    } catch (e) {
      ctx.throw(401, '评论不存在')
    }

    if (targetComment == null) {
      ctx.throw(401, '评论不存在')
      return
    }

    if (targetComment.userId.toString() !== ctx.userId) {
      ctx.throw(401, '没有权限执行此操作')
    }

    targetComment.delete()

    ctx.body = success()

    await next()
  }

  /**
   * 分页获取我的评论
   */
  async getMyComments(ctx: DefaultContext, next: Next) {
    const { size, current } = ctx.query
    const { skip, limit } = paging(size, current)
    const total = await Comment.count({ userId: ctx.userId })
    const temp = await Comment.find({ userId: ctx.userId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)

    const res = temp.map(item => {
      const { _id, newsId, content, parentId, createdAt } = item
      return { _id, newsId, content, parentId, time: getCorrectTime(createdAt) }
    })

    ctx.body = success({ records: res, total })

    await next()
  }

  /**
   * 分页获取评论
   */
  async getComments(ctx: DefaultContext, next: Next) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      type: { type: ['number', 'string'], required: true, min: 1, max: 2 },
      orderBy: { type: ['number', 'string'], required: true, min: 1, max: 2 },
    })

    const { size, current, type, orderBy, id } = ctx.query
    const { skip, limit } = paging(size, current)

    let matches

    if (Number(type) === 1) {
      matches = { newsId: id, parentId: 'root' }
    }

    if (Number(type) === 2) {
      matches = { parentId: id }
    }

    const total = await Comment.count({ ...matches })
    const temp = await Comment.aggregate([
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'commentId',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $match: matches },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])

    let res = temp.map(item => {
      const { _id, content, createdAt, likes, user, following } = item
      const { name: userName, avatar: userAvatar, _id: userId } = user[0] || {}
      const likesNum = likes.length
      let isLike = false

      for (let i = 0; i < likesNum; i += 1) {
        if (likes[i].userId === ctx.userId) {
          isLike = true
          break
        }
      }

      const obj = {
        _id,
        content,
        time: getCorrectTime(createdAt),
        likesNum,
        userName,
        userAvatar,
        isMine: userId?.toString() === ctx.userId,
        isLike,
      }

      if (Number(type) === 1) {
        ;(obj as any).followNum = following.length
      }

      return obj
    })

    if (Number(orderBy) === 2) {
      res = res.sort((a, b) => b.likesNum - a.likesNum)
    }

    ctx.body = success({ records: res, total })

    await next()
  }
}

export default new CommentCtl()
