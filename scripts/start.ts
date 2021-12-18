import mongoose from 'mongoose'
import { connectionStr } from '@db'
import app from '@app'

app.listen(8877, () => {
  console.log('服务启动成功')

  mongoose.connect(connectionStr, () => {
    console.log('mongoDB 链接成功')
  })

  mongoose.connection.on('error', console.error)
})
