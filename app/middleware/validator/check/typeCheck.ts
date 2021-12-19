import fs from 'fs'

const typeCheck = (param: any, type: string | Array<string>) => {
  if (param == null) {
    return
  }

  const paramType = Object.prototype.toString.call(param).slice(8, -1).toLowerCase()
  let flag = Array.isArray(type) ? type.includes(paramType) : type === paramType

  if (type === 'file') {
    try {
      flag = fs.statSync(param.path).isFile()
    } catch (err) {
      flag = false
    }
  }

  if (flag === false) {
    throw new Error('{key} 的类型不正确')
  }
}

export default typeCheck
