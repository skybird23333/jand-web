import { NextFunction, Request, Response, Router } from "express"
import { jandClient } from "../utils/jandClient"
import { apiError } from "../utils/apiError"
import { hostname, userInfo } from "node:os"
import { IDaemonSystemInfoResponse } from "../typings/interfaces"
import batteryLevel from "battery-level"
import { getSysInfoList } from "../strategies/sysinfoRequestStrategies"
import { getSystemInformation } from "../utils/helpers"

export const router = Router()

router.get('/status/', async (req: Request, res: Response) => {
    const status = await jandClient.getDaemonStatus()
    res.json(status)
})

router.get('/system/', async (req: Request, res: Response) => {
    const data: IDaemonSystemInfoResponse = await getSystemInformation()
    res.json(data)
})

router.post('/save', async (req: Request, res: Response) => {
    await jandClient.saveConfig()
    res.status(204).send()
})

router.get('/all', async (req: Request, res: Response) => {
    const data = await getSysInfoList()
    res.json(data)
})