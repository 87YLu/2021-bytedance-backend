import { Schema, model, Document } from 'mongoose'

const userSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

interface UserProps extends Document {
  name: string
  email: string
  password: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

export default model<UserProps>('User', userSchema, 'users')
