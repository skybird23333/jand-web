import { RuntimeProcessInfo } from "jand-ipc"
import { jandClient } from "../utils/jandClient"
import multimachine from "../modules/multimachinehost"

export async function getRuntimeProcessList() {
    if (multimachine.isMultiMachine()) {
        await multimachine.fetchAllHosts()
        return multimachine.combindProcessList
    } else {
        return jandClient.getRuntimeProcessList()
    }
}

export async function getProcessInfo(name: string) {
    if (multimachine.isMultiMachine()) {
        return await multimachine.getProcess(name)
    } else {
        return jandClient.getProcessInfo(name)
    }
}