import { Schema, model, Document } from 'mongoose'

const LogSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    userId: {
      type: String,
      required: false,
    },
    api: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

const SECONDS_IN_30_DAYS = 60 * 60 * 24 * 30

LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: SECONDS_IN_30_DAYS })

interface logProps extends Document {
  userId: string
  api: string
  params: any
  createdAt: Date | any
  updatedAt: Date
}

export default model<logProps>('Log', LogSchema, 'logs')
