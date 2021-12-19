const numberCheck = (
  rules: {
    min?: number
    max?: number
  },
  param?: number,
) => {
  if (param == null) {
    return
  }

  const { min, max } = rules

  if (min != null && min > param) {
    throw new Error(`参数 {key} 必须大于或等于 ${min}`)
  }

  if (max != null && max < param) {
    throw new Error(`参数 {key} 必须小于或等于 ${max}`)
  }
}

export default numberCheck
