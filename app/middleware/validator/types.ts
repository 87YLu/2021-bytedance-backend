export interface IParams {
  [key: string]: any
}

export interface IRules {
  [key: string]: {
    required?: Boolean
    type?: String | Array<String>
    minLength?: Number
    maxLength?: Number
    min?: Number
    max?: Number
    pattern?: RegExp
  }
}
