const paging: (
  size?: number | string,
  current?: number | string,
) => {
  skip: number
  limit: number
} = (size = 10, current = 1) => {
  const currentPage = Math.max(Number(current), 1) - 1
  const perPage = Math.max(Number(size), 1)

  return {
    skip: currentPage * perPage,
    limit: perPage,
  }
}

export default paging
