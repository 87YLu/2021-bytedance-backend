const success = (data?: any) => {
  return {
    message: 'success',
    status: 200,
    success: true,
    data,
  }
}

export default success
