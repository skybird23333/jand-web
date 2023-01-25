/**
 * When the server encounters a Fatal Error.
 */
export default class FatalError extends Error {
    constructor() {
        super()
        this.name = 'JanDServerFatalError'
    }
}