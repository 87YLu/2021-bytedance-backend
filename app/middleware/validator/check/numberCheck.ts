const numberCheck = (
  param: number,
  rules: {
    min?: number
    max?: number
  },
) => {
  const { min, max } = rules

  if (min && min > param) {
    throw new Error(`参数 {key} 必须大于或等于 ${min}`)
  }

  if (max && max < param) {
    throw new Error(`参数 {key} 必须小于或等于 ${max}`)
  }
}

export default numberCheck
