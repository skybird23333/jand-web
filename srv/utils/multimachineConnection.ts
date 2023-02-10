import { EventEmitter } from "node:stream"
import fetch from "node-fetch"
import { IPeerMachine } from "srv/typings/interfaces"
const http = require('http')
/**
 * This class is responsible for handling the communication with other machines.
 * There may be multiple instances of this as one instance is responsible for one machine.
 * @see multimachine.ts
 */
export class multimachineConnection extends EventEmitter {
    host: IPeerMachine
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

        const httpsAgent = new http.Agent({
            rejectUnauthorized: false
        })

        const runConnectionTest = async () => {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => {
                    controller.abort()
                    retryCount++
                    return
                }, 5000)
                const res = await fetch(`https://${this.host.host}:${this.host.port}/api/multimachine/connection-test`, {
                    signal: controller.signal,
                    headers: {
                        Authorization: `${this.token}`
                    },
                    agent: httpsAgent
                })
                clearTimeout(timeoutId)
                if (res.status === 200) {
                    this.connected = true
                    this.connectFailError = ''
                    return
                } else if (!res.ok) {
                    this.connectFailError = `${res.status} ${res.statusText} ${res.body}`
                    this.connected = false
                    return
                }
            } catch (e) {
                this.connectFailError = e.message
                this.connected = false
                return
            }
        }

        while (retryCount < 10) {
            await runConnectionTest()
            if (this.connected) {
                return
            } else continue
        }
        console.error(`[multimachinehost] Failed to connect to ${this.host.name}(${this.host.host}) after 10 retries`)
        console.error(`[multimachinehost] Error: ${this.connectFailError}`)
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