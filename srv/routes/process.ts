import { apiError } from "../modules/apiError"
import validateRequestBody from "../utils/validate-request-body"
import { Request, Response, Router } from "express"
import { getRuntimeProcessList, setEnabled, setProcessProperty } from "jand-ipc"

export const router = Router()

router.get('/all', async (req: Request, res: Response) => {
    res.json(await getRuntimeProcessList())
})

router.patch('/:name/runconfig', async(req, res) => {
    let data
    
    try {
        data = validateRequestBody(
            JSON.stringify(req.body),
            {
                enabled: {
                    type: 'boolean'
                },
                autorestart: {
                    type: 'boolean'    
                }
            }
        )
    
    } catch(e) {
        if (e instanceof TypeError) return apiError(req, res, 400, e.message)
    }

    if(!data) return apiError(req, res, 400, "No valid fields provided")

    if(data.enabled) {
        setEnabled(req.params.name, data.enabled)
    }

    if(data.autorestart) {
        setProcessProperty(req.params.name, 'AutoRestart', data.autorestart)
    }
})