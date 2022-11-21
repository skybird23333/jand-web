import { NextFunction, Request, Response, Router } from "express"
import { jandClient } from "../modules/jandClient"
import { apiError } from "../modules/apiError"
import { hostname, userInfo } from "node:os"
import { IDaemonSystemInfoResponse } from "../typings/interfaces"

export const router = Router()

router.get('/status/', async (req: Request, res: Response) => {
    const status = await jandClient.getDaemonStatus()
    res.json(status)
})

router.get('/system/', async (req: Request, res: Response) => {
    const data: IDaemonSystemInfoResponse = {
        username: userInfo().username,
        hostname: hostname()
    }
    res.json(data)
})