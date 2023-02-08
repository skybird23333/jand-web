import { NextFunction } from 'express'
import { IJandWebProcess } from '../typings/interfaces'
import { jandClient } from './jandClient'

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

    constructor() {
    }

    isMultiMachine() {
        return false
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

    getProcessList() {
        return this.combindProcessList
    }

    getProcess(name: string) {
        const process = this.combindProcessList.find(p => p.Name === name)
        if (!process.Host) { //process is on main
            jandClient.getProcessInfo(name)
        } else {
            //TODO: Request it from host
        }
    }
}