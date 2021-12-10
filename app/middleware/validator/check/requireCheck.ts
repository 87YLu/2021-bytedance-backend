const requireCheck = (param: any, required: boolean) => {
  if (param == null) {
    if (required) {
      throw new Error('{key} 是必传参数')
    }
  }
}

export default requireCheck
