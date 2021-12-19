const byteToM = (byte: number) => {
  return (byte / (1024 * 1024)).toFixed()
}

const defaultMaxSize = 100 * 1024 * 1024 // 100MB

const fileCheck = (rules: { fileType?: string; maxSize?: number }, param: any) => {
  if (param == null) {
    return
  }

  const { type, size } = param
  const { fileType, maxSize = defaultMaxSize } = rules

  if (size === 0) {
    throw new Error('{key} 大小不能为空')
  }

  if (fileType) {
    const targetType = type.split('/')[0]
    if (targetType !== fileType) {
      throw new Error('{key} 的文件类型错误')
    }
  }

  if (size > maxSize) {
    throw new Error(`{key} 最大支持${byteToM(maxSize)}MB`)
  }
}

export default fileCheck
