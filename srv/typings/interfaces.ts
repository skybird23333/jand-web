import { ProcessInfo, RuntimeProcessInfo } from "jand-ipc"
import { UserInfo } from "node:os"

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
    userInfo: UserInfo<string>
    usage: {
        cpu: number
        totalmem: number
        freemem: number
    }
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


