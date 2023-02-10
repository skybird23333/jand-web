import { NextFunction } from 'express'
import config from '../utils/configManager'
import { IJandWebProcess, IMultimachineHostConfig, IMultimachinePeerConfig } from '../typings/interfaces'
import { jandClient } from '../utils/jandClient'
import { genRandStr } from '../utils/helpers'
import { createHash } from 'crypto'
import { multimachineConnection } from '../utils/multimachineConnection'

/**
 * The multimachine class exports functions for communicating with other machines when in MultiMachine mode.
 * This class is responsible for process caching and combining logic. Communication is done in multimachineConnection
 * For dynamically handling process requesting see strategies/processRequestStrategies
 */
export default new class MultiMachine {
    processes: {
        [host: string]: IJandWebProcess[]
    } = {}
    combindProcessList: IJandWebProcess[]
    config: IMultimachineHostConfig
    connections: multimachineConnection[]

    constructor() {
        this.config = config.getConfigforModule<IMultimachineHostConfig>('multimachinehost')
        if (!this.config) {
            this.config = {
                enabled: false,
                token: genRandStr(),
                peers: []
            }
            config.replaceConfigforModule('multimachinehost', this.config)
        }
        if (!this.config.enabled) return
        this.initialize()
        console.log('[multimachinehost] You are now in MultiMachine mode. Use the following config file for peers:')
        console.log(`[multimachinehost] ${this.generatePeerConfig()}`)
    }

    generatePeerConfig(): string {
        return JSON.stringify({
            "config": {
                multimachinepeer: {
                    enabled: true,
                    tokenHash: createHash('sha256').update(this.config.token).digest('hex'),
                }
            }
        })
    }

    initialize() {
        for (const peer of this.config.peers) {
            const connection = new multimachineConnection(peer, this.config.token)
            connection.initiateConnectionTest()
            this.connections.push(connection)
        }
    }

    isMultiMachine() {
        return this.config.enabled
    }

    calculateCombinedProcessList() {
        this.combindProcessList = []
        for (const host in this.processes) {
            for (const process of this.processes[host]) {
                this.combindProcessList.push(Object.assign({
                    Name: `${process.Name}` +
                        this.combindProcessList.find(
                            p => p.Name === process.Name
                        ) ? `-${host}` : ``,
                    Host: host
                }, process))
            }
        }
    }

    async fetchProcesses() {
        for (const peer of this.connections) {
            if(!peer.connected) continue
            //TODO
        }
        this.processes['main'] = await jandClient.getRuntimeProcessList()
        this.calculateCombinedProcessList()
    }

    getProcessList() {
        return this.combindProcessList
    }

    getProcess(name: string) {
        const process = this.combindProcessList.find(p => p.Name === name)
        if (!process.Host) { //process is on main
            jandClient.getProcessInfo(name)
        } else {
            return this.processes[process.Host].find(p => p.Name === name)
            //TODO: Request it from host
        }
    }
}