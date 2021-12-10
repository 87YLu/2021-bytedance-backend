const stringCheck = (
  param: string,
  rules: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
  },
) => {
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

  if (min && min > Number(param)) {
    throw new Error(`参数 {key} 必须大于或等于 ${min}`)
  }

  if (max && max < Number(param)) {
    throw new Error(`参数 {key} 必须小于或等于 ${max}`)
  }
}

export default stringCheck
