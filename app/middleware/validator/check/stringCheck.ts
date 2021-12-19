const stringCheck = (
  rules: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
  },
  param?: string,
) => {
  if (param == null) {
    return
  }

  const { minLength, maxLength, min, max, pattern } = rules

  const length = param.length

  if (minLength && minLength > length) {
    throw new Error(`{key} 的长度必须大于或等于 ${minLength}`)
  }

  if (maxLength && maxLength < length) {
    throw new Error(`{key} 的长度必须小于或等于 ${maxLength}`)
  }

  if (pattern && pattern.test(param) === false) {
    throw new Error('参数 {key} 的格式错误')
  }

  if (min != null || max != null) {
    if (isNaN(Number(param))) {
      throw new Error('参数 {key} 的格式错误')
    }
  }

  if (min != null && min > Number(param)) {
    throw new Error(`参数 {key} 必须大于或等于 ${min}`)
  }

  if (max != null && max < Number(param)) {
    throw new Error(`参数 {key} 必须小于或等于 ${max}`)
  }
}

export default stringCheck
