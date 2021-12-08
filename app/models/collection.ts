import { Schema, model, Document } from 'mongoose'

const CollectionSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    userId: {
      type: String,
      required: true,
    },
    newsId: {
      type: Schema.Types.ObjectId,
      ref: 'News',
    },
  },
  {
    timestamps: true,
  },
)

interface collectionProps extends Document {
  type: number
  userId: string
  newsId: string
  createdAt: Date
  updatedAt: Date
}

export default model<collectionProps>('collection', CollectionSchema, 'collections')
