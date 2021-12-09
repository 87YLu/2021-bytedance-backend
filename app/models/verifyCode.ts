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

const SECONDS_IN_15_MINUTES = 60 * 15

verifyCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: SECONDS_IN_15_MINUTES })

interface verifyCodeProps extends Document {
  code: string
  email: string
  type: number
  createdAt: Date
  updatedAt: Date
}

export default model<verifyCodeProps>('VerifyCode', verifyCodeSchema, 'verify_codes')
