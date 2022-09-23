import rest from "./rest"

export default class Client {
    constructor(token) {
        this.token = token || null
        this.rest = new rest(token)
    }

    async getAllProcess() {
        return await this.rest.get('/process/all')
    }
}
