import { Schema, model, Document } from 'mongoose'

const newsTypeSchema = new Schema({
  __v: {
    type: Number,
    select: false,
  },
  typeId: {
    type: Number,
    required: true,
  },
  typeName: {
    type: String,
    required: true,
  },
})

interface newsTypeProps extends Document {
  typeId: number
  typeName: string
}

export default model<newsTypeProps>('NewsType', newsTypeSchema, 'news_types')
