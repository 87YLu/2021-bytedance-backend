import { Schema, model, Document } from 'mongoose'

const verifyCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

interface verifyCodeProps extends Document {
  code: string
  email: string
  type: number
  createdAt: Date
  updatedAt: Date
}

verifyCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 })

export default model<verifyCodeProps>('VerifyCode', verifyCodeSchema, 'verify_codes')
