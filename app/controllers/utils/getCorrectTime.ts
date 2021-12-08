import moment from 'moment'

const getCorrectTime = (mongoDBDate: Date, formatType = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(mongoDBDate).format(formatType)
}

export default getCorrectTime
