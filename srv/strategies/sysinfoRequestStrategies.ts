import { jandClient } from "../utils/jandClient"
import batteryLevel from "battery-level"
import os from "os"
import multimachine from "../modules/multimachinehost"
import { getSystemInformation } from "../utils/helpers"

export async function getSysInfoList() {
    if (multimachine.isMultiMachine()) {
        await multimachine.fetchAllHosts()
        return Object.keys(multimachine.sysinfoList).map(key => {
            return {
                daemon: multimachine.sysinfoList[key].daemon,
                system: multimachine.sysinfoList[key].system,
                processes: multimachine.processes[key]
            }
        })
    } else {
        return [{
            daemon: await jandClient.getDaemonStatus(),
            system: await getSystemInformation(),
            processes: await jandClient.getRuntimeProcessList()
        }]
    }
}