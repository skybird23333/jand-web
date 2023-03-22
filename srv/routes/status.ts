import batteryLevel from "battery-level";
import { Router } from "express";
import { hostname, userInfo } from "os";
import { getSystemInformation } from "../utils/helpers";
import { jandClient } from "../utils/jandClient";

export const router = Router()

router.get('', async (req, res) => {
    const processes = await jandClient.getRuntimeProcessList()
    const daemon = await jandClient.getDaemonStatus()
    const system = getSystemInformation()

    res.json({
        processes,
        daemon,
        system
    })
})