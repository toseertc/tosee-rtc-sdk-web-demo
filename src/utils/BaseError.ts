export default class BaseError extends Error {
  constructor(code: number, message: string, name: string = 'Error') {
    super(message)

    this.code = code
    this.name = name
  }

  code: number
}
