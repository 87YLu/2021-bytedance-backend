import nodemailer from 'nodemailer'
import { emailSourceAddress, emailSourcePass, host, secure, port } from '@email'

const transport = nodemailer.createTransport({
  host,
  secure,
  port,
  auth: {
    user: emailSourceAddress,
    pass: emailSourcePass,
  },
})

const mailOptions = {
  from: `【给后台疯狂提issue】 ${emailSourceAddress}`,
  to: '{to}',
  subject: '{subject}',
  html:
    '<p>您的验证码是：{verification}。此验证码15分钟内有效，请不要把验证码泄露给其他人。如非本人操作，可不用理会！</p>',
}

const sendVerificationEmail = async ({
  to,
  subject,
  verification,
}: {
  to: string
  subject: string
  verification: string
}) => {
  const options = Object.assign({}, mailOptions)

  options.to = options.to.replace('{to}', to)
  options.subject = options.subject.replace('{subject}', subject)
  options.html = options.html.replace('{verification}', verification)

  await transport.sendMail(options)
}

export default sendVerificationEmail
