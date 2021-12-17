import { IRules } from './middleware/validator/types'

declare module 'koa' {
  interface ExtendableContext {
    verifyParams: (obj: IRules) => void
    success: (data?: any) => void
  }
}
