import { IParams, IRules } from '../types'
import requireCheck from './requireCheck'
import typeCheck from './typeCheck'
import stringCheck from './stringCheck'
import numberCheck from './numberCheck'
import fileCheck from './fileCheck'

const check = (params: IParams, rules: IRules) => {
  const ruleKeys = Object.keys(rules)

  const isType = (targetType: string, type: string | Array<string>) => {
    if (Array.isArray(type)) {
      return type.includes(targetType)
    }

    return targetType === type
  }

  let currentKey: string = ''

  try {
    for (const key of ruleKeys) {
      const param = params[key]
      const {
        required = false,
        type,
        minLength,
        maxLength,
        min,
        max,
        pattern,
        fileType,
        maxSize,
      } = rules[key]
      currentKey = key

      requireCheck(param, required)

      if (required) {
        typeCheck(param, type)

        isType('string', type) && stringCheck(param, { minLength, maxLength, min, max, pattern })

        isType('number', type) && numberCheck(param, { min, max })

        isType('file', type) && fileCheck(param, { fileType, maxSize })
      }
    }
  } catch (err: any) {
    return err.message.replace('{key}', currentKey)
  }
}

export default check
