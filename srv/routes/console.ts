import { NextFunction, Request, Response, Router } from "express"
import ConsoleLogStreamManager from "../utils/ConsoleLogStreamManager"
import { apiError } from "../utils/apiError"
import { jandClient } from "../utils/jandClient"

export const router = Router()

const streamManager = new ConsoleLogStreamManager()

router.get('/:name/event', async function (req, res) {
    //FIXME: doesnt work when multiple logs, need to fix jand-ipc
    if(!await jandClient.getProcessInfo(req.params.name)) return apiError(req, res, 404, 'Process not found')

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    })

    res.write('retry: 10000\n\n');

    streamManager.addLogStream(res, req.params.name)
})

router.post('/:name/send', async function (req, res, next) {
    if(!await jandClient.getProcessInfo(req.params.name)) return apiError(req, res, 404, 'Process not found')
    if (!req.body.data) return apiError(req, res, 400, 'No data provided')
    await jandClient.sendProcessStdinLine(req.params.name, req.body.data)
    res.status(204).send()
})