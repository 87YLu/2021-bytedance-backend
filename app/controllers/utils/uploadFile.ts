import fs from 'fs'
import path from 'path'

interface UploadRes {
  filePath: string
  basename: string
}

const uploadFile = (
  file: any,
  callback?: (oldPath: string, oldName: string) => Promise<UploadRes>,
) =>
  new Promise<UploadRes>(resolve => {
    const reader = fs.createReadStream(file.path)
    const basename = path.basename(file.path)
    const filePath = path.join(process.cwd(), './public/uploads') + `/${basename}`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)

    if (callback) {
      reader.on('end', async () => {
        const res = await callback(filePath, basename)
        resolve(res)
      })
    } else {
      resolve({ filePath, basename })
    }
  })

export default uploadFile
