import batteryLevel from "battery-level";
import { Router } from "express";
import { hostname, userInfo } from "os";
import { jandClient } from "../utils/jandClient";

export const router = Router()

router.get('', async (req, res) => {
    const processes = await jandClient.getRuntimeProcessList()
    const daemon = await jandClient.getDaemonStatus()
    const system = {
        username: userInfo().username,
        userInfo: userInfo(),
        hostname: hostname(),
        battery: await batteryLevel()
    }

    res.json({
        processes,
        daemon,
        system
    })
})