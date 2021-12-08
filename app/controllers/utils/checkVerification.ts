import { VerifyCode } from '@models'

const checkVerification = async ({
  type,
  email,
  code,
}: {
  type: number
  email: string
  code: string
}) => {
  const exist = await VerifyCode.findOne({
    type,
    email,
    code,
  })

  if (exist == null) {
    return false
  }

  return true
}

export default checkVerification
