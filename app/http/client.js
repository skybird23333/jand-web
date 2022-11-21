import rest from "./rest"

export default class Client {
    constructor(token) {
        this.token = token || null
        this.rest = new rest(token)
    }

    async getAllProcess() {
        return await this.rest.get('/process/all')
    }

    async getProcess(name) {
        return await this.rest.get(`/process/${name}`)
    }

    async editProcessRunningConfig(name, config) {
        return await this.rest.patch(`/process/${name}/edit`, config)
    }

    async stopProcess(name) {
        return await this.rest.post(`/process/${name}/stop`)
    }

    async restartProcess(name) {
        return await this.rest.post(`/process/${name}/restart`)
    }

    async checkDirectoryWritable(path) {
        return await this.rest.post(`/create/checkdir/`, {
            dir: path
        })
    }

    startLogStream(name) {
        return new EventSource(this.rest.baseURL + `/console/${name}/event` );
    }

    async getSystemInfo() {
        return await this.rest.get(`/daemon/system`)
    }
    
    async getDaemonStatus() {
        return await this.rest.get(`/daemon/status`)
    }

    async saveConfig() {
        return await this.rest.post(`/daemon/save`)
    }

    async sendToProcessStdin(name, data) {
        return await this.rest.post(`/console/${name}/send`, {
            data
        })
    }
}
