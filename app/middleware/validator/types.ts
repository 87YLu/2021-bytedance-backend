export interface IParams {
  [key: string]: any
}

export interface IRules {
  [key: string]: {
    type: string | Array<string>
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
    fileType?: string
    maxSize?: number
  }
}
