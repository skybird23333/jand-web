import { NextFunction, Request, Response, Router } from "express"
import { jandClient } from "../modules/jandClient"
import { apiError } from "../modules/apiError"
import { hostname, userInfo } from "node:os"
import { IDaemonSystemInfoResponse } from "../typings/interfaces"
import batteryLevel from "battery-level"

export const router = Router()

router.get('/status/', async (req: Request, res: Response) => {
    const status = await jandClient.getDaemonStatus()
    res.json(status)
})

router.get('/system/', async (req: Request, res: Response) => {
    const battery = await batteryLevel()
    const data: IDaemonSystemInfoResponse = {
        username: userInfo().username,
        hostname: hostname(),
        battery: isNaN(battery) ? undefined : battery
    }
    res.json(data)
})

router.post('/save', async (req: Request, res: Response) => {
    await jandClient.saveConfig()
    res.status(204).send()
})