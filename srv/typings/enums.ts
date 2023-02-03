export enum userPermissions {
    VIEW_HOMEPAGE               = 1 << 0, //Be able to access the dashboard at all
    VIEW_PROCESSES              = 1 << 1, //Be able to see a list of processes
    CREATE_PROCESS              = 1 << 2, //Be able to create a new process
    VIEW_PROCESS_INFO           = 1 << 3, //Be able to see their config information(inc directory, launch config, pid)
    VIEW_PROCESS_STATUS         = 1 << 4, //Be able to see whether a process is running
    MANAGE_PROCESS_STATUS       = 1 << 5, //Depends on VIEW_PROCESS_STATUS: Be able to start/stop a process
    VIEW_PROCESS_LOGS           = 1 << 6, //Be able to see the live logs of a process
    VIEW_PROCESS_HISTORY_LOGS   = 1 << 7, //Depends on VIEW_PROCESS_LOGS: Be able to see the historical logs of a process
    SEND_PROCESS_STDIN          = 1 << 8, //Depends on VIEW_PROCESS_LOGS: Be able to send input to a process
}