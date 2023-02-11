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
    host: string
    port: number
}


export type IConfig = IMultimachineHostConfig | IMultimachinePeerConfig | IBaseConfig

export interface IBaseConfig {
    enabled: boolean
}

/**
 * multimachinehost
 */
/**
 * multimachinehost
 */
export interface IMultimachineHostConfig extends IBaseConfig {
    peers: IPeerMachine[]
    token: string
}

/**
 * multimachinepeer
 */
export interface IMultimachinePeerConfig extends IBaseConfig{
    tokenHash: string
}


