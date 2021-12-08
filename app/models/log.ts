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

interface logProps extends Document {
  userId: string
  api: string
  params: any
  createdAt: Date | Object
  updatedAt: Date
}

export default model<logProps>('Log', LogSchema, 'logs')
