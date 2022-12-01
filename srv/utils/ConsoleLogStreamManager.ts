import { Response } from "express";
import { jandClient } from "../modules/jandClient";


/**
 * This class handles the log events from JanD and sends them to individual response streams.
 */
class ConsoleLogStreamManager {

    private streams: {res: Response, procname: string}[] = []

    constructor() {
        jandClient.on('errlog', (data) => {
            this.handleLogEvent(data)
        })
        jandClient.on('outlog', (data) => {
            this.handleLogEvent(data)
        })
    }

    private handleLogEvent(data: any) {
        this.streams.map((stream) => {
            if (stream.procname === data.Process) {
                stream.res.write("data:" + JSON.stringify({
                    data: data.Value.replace(/\u001B\[.+39m/, ''),
                    type: (data.Event === 'errlog') ? 'stderr' : 'stdout',
                    time: Date.now()
                }) + "\n\n")
            }
        })
    }

    /**
     * Accepts a response object and start streaming log through res.send.
     * When the response is closed, the stream is automatically stopped.
     * @param res The response object
     * @param procname The process name to listen for
     */
    addLogStream(res: Response, procname: string) {
        this.streams.push({res, procname})
        jandClient.subscribeLogEvent(procname)
        res.socket.on('end', () => {
            this.streams.splice(this.streams.indexOf({res, procname}), 1)
        })
        //TODO: send back latest 15 lines of log as per API
    }
}

export default ConsoleLogStreamManager