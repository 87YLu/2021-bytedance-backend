import { Schema, model, Document } from 'mongoose'

const NewsSchema = new Schema({
  __v: {
    type: Number,
    select: false,
  },
  title: {
    type: String,
    required: true,
  },
  digest: {
    type: String,
    required: true,
    select: false,
  },
  img: {
    type: String,
    required: true,
    select: false,
  },
  content: {
    type: String,
    required: true,
    select: false,
  },
  publishTime: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
    select: false,
  },
})

interface newsProps extends Document {
  title: string
  digest: string
  img: string
  content: string
  publishTime: string
  source: string
  type: number
}

export default model<newsProps>('News', NewsSchema, 'news')
