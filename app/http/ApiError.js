/**
 * Error from the API, returned by handler functions
 */
 export default class ApiError extends Error {
    constructor(message, statusCode, errorInfo) {
        super(`${statusCode}: ${message || "An API error occured"}`)
        Object.assign(this, errorInfo)
        if(errorInfo) {
            this.errorCode = errorInfo.code
        }
        this.statusCode = statusCode
    }
}