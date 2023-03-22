import { EventEmitter } from "node:stream"
import fetch from "node-fetch"
import { IDaemonSystemInfoResponse, IPeerMachine } from "srv/typings/interfaces"
import { DaemonStatus, RuntimeProcessInfo } from "jand-ipc"
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
    httpsAgent = new http.Agent({
        rejectUnauthorized: false
    })

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


        const runConnectionTest = async () => {
            try {
                const controller = new AbortController()
                retryCount++
                const timeoutId = setTimeout(() => {
                    controller.abort()
                    return
                }, 5000)
                const res = await fetch(`http://${this.host.host}:${this.host.port}/api/multimachine/connection-test`, {
                    signal: controller.signal,
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    agent: this.httpsAgent
                })
                clearTimeout(timeoutId)
                if (res.ok) {
                    this.connected = true
                    this.connectFailError = ''
                    this.emit('connected')
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
                break
            } else continue
        }
        if(retryCount > 10) {
            this.emit('connectionFail')
        }
    }

    async getProcesses(): Promise<RuntimeProcessInfo[]> {
        const res = await fetch(`http://${this.host.host}:${this.host.port}/api/process/all`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            agent: this.httpsAgent
        })
        if (res.ok) {
            return await res.json()
        } else {
            throw new Error(`${res.status} ${res.statusText} ${res.body}`)
        }
    }
    
    async getSystemStatus(): Promise<{processes: RuntimeProcessInfo[], daemon: DaemonStatus, system: IDaemonSystemInfoResponse}> { //TODO: add type
        const res = await fetch(`http://${this.host.host}:${this.host.port}/api/status`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            agent: this.httpsAgent
        })
        if (res.ok) {
            return await res.json()
        } else {
            throw new Error(`${res.status} ${res.statusText} ${res.body}`)
        }
    }
}