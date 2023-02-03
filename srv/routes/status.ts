import { Router } from "express";
import { hostname, userInfo } from "os";
import { jandClient } from "../modules/jandClient";

export const router = Router()

router.get('', (req, res) => {
    const processes = jandClient.getRuntimeProcessList()
    const daemon = jandClient.getDaemonStatus()
    const system = {
        username: userInfo().username,
        userInfo: userInfo(),
        hostname: hostname()
    }

    res.json({
        processes,
        daemon,
        system
    })
})