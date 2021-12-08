import { VerifyCode } from '@models'
import random from './random'

const createVerification = async ({ type, email }: { type: number; email: string }) => {
  const code = random(0, 999999).toString().padStart(6, '0')

  await new VerifyCode({
    type,
    email,
    code,
  }).save()

  return code
}

export default createVerification
