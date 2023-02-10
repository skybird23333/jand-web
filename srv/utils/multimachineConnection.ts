import { EventEmitter } from "node:stream"

/**
 * This class is responsible for handling the communication with other machines.
 * There may be multiple instances of this as one instance is responsible for one machine.
 * @see multimachine.ts
 */
export class multimachineConnection extends EventEmitter {
    host: string
    connected: boolean
    connectFailError: string
    token: string
    constructor(host, token) {
        super()
        this.host = host
        this.token = token
    }

    /** 
     * Initiate a connection test to the target machine.
     * This is the only request that will affect connected and connectFailError.
     */
    async initiateConnectionTest() {
        let retryCount = 0
        while (retryCount < 10) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => {
                    controller.abort()
                    retryCount++
                    return
                }, 5000)
                const res = await fetch(`http://${this.host}/multimachine/connection-test`, {
                    signal: controller.signal,
                    headers: {
                        Authorization: `${this.token}`
                    }
                })
                clearTimeout(timeoutId)
                if (res.status === 200) {
                    this.connected = true
                    this.connectFailError = ''
                    return
                } else if(!res.ok) {
                    this.connectFailError = `${res.status} ${res.statusText} ${res.body}`
                    this.connected = false
                    return
                }
            } catch(e) {
                this.connectFailError = e.message
                this.connected = false
                return
            }
        }
    }

    async getProcesses() {
        const res = await fetch(`http://${this.host}/multimachine/processes`, {
            headers: {
                Authorization: `${this.token}`
            }
        })
        if (res.ok) {
            return await res.json()
        } else {
            throw new Error(`${res.status} ${res.statusText} ${res.body}`)
        }
    }
}