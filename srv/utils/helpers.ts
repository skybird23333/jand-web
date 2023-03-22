import { userInfo, hostname, freemem, totalmem } from "os";
import batteryLevel from "battery-level";
import { IDaemonSystemInfoResponse } from "../typings/interfaces";
import { cpuUsage } from "os-utils";

export function genRandStr() {
    const length = 20 + Math.floor(Math.random() * 10);
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

async function getCpuUsage(): Promise<number> {
    return new Promise((resolve, reject) => {
        cpuUsage((usage) => {
            resolve(usage)
        })
    })
}

export async function getSystemInformation(): Promise<IDaemonSystemInfoResponse> {
    const battery = await batteryLevel();
    const data: IDaemonSystemInfoResponse = {
        username: userInfo().username,
        hostname: hostname(),
        userInfo: userInfo(),
        battery: isNaN(battery) ? undefined : battery,
        usage: {
            cpu: await getCpuUsage(),
            totalmem: totalmem(),
            freemem: freemem()
        }
    };
    return data;
}