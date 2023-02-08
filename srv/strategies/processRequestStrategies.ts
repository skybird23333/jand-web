import { RuntimeProcessInfo } from "jand-ipc"
import { jandClient } from "../modules/jandClient"
import multimachine from "../modules/multimachineHost"

export function getRuntimeProcessList() {
    if (multimachine.isMultiMachine()) {
    } else {
        return jandClient.getRuntimeProcessList()
    }
}

export function getProcessInfo(name: string) {
    if (multimachine.isMultiMachine()) {
        return multimachine.getProcess(name)
    } else {
        return jandClient.getProcessInfo(name)
    }
}