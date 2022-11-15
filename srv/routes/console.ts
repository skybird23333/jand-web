import { NextFunction, Request, Response, Router } from "express"
import ConsoleLogStreamManager from "../utils/ConsoleLogStreamManager"
import { apiError } from "../modules/apiError"
import { jandClient } from "srv/modules/jandClient"

export const router = Router()

const streamManager = new ConsoleLogStreamManager()

router.get('/:name/event', function (req, res) {
    //FIXME: doesnt work when multiple logs, need to fix jand-ipc

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    streamManager.addLogStream(res, req.params.name)
})

router.post('/console/:name/send', async function (req, res, next) {
    if (!req.body.data) return apiError(req, res, 400, 'No data provided')
    await jandClient.sendProcessStdinLine(req.params.name, req.body.data)
    res.status(204).send()
})