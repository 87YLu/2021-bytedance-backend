import { Schema, model, Document } from 'mongoose'

const CommentSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    newsId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Comment',
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

interface commentProps extends Document {
  userId: string
  newsId: string
  content: string
  parentId: string
  following: string[]
  createdAt: Date
  updatedAt: Date
}

export default model<commentProps>('Comment', CommentSchema, 'comments')
