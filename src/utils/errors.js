class BaseError extends Error {
  constructor({ message, statusCode, body = '' }) {
    super(message)
    this.statusCode = statusCode
    this.body = body
  }

  toString() {
    return `${this.constructor.name}: ${this.message}`
  }
}

export class ApiError extends BaseError {}
export class ValidationError extends BaseError {}
