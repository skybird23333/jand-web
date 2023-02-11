import { jandClient } from "../utils/jandClient"
import batteryLevel from "battery-level"
import os from "os"
import multimachine from "../modules/multimachinehost"
import { getSystemInformation } from "../utils/helpers"

export async function getSysInfoList() {
    if (multimachine.isMultiMachine()) {
        await multimachine.fetchAllHosts()
        return multimachine.sysinfoList
    } else {
        return [{
            daemon: await jandClient.getDaemonStatus(),
            system: await getSystemInformation()
        }]
    }
}