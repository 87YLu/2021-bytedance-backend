import { Schema, model, Document } from 'mongoose'

const LikeSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    userId: {
      type: String,
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  },
)

interface likeProps extends Document {
  userId: string
  commentId: string
  createdAt: Date
  updatedAt: Date
}

export default model<likeProps>('Like', LikeSchema, 'likes')
