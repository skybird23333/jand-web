import { ProcessInfo, RuntimeProcessInfo } from "jand-ipc"

export interface IRuntimeConfigData {
    enabled: boolean
    autorestart: boolean
}

export interface IRenameProcessData {
    name: string
}

export interface IDaemonSystemInfoResponse {
    hostname: string
    username: string
    battery?: number
}

export interface IJandWebProcess extends RuntimeProcessInfo {
    Host?: string
}

export interface IPeerMachine {
    name: string
    host: string
    port: number
}


export interface IMultimachineHostConfig {
    enabled: boolean
    isPeer: boolean
}

export interface IMultimachinePeerConfig {}