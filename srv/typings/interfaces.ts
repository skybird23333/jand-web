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