import { apiError } from "../modules/apiError"
import validateRequestBody from "../utils/validate-request-body"
import { Request, Response, Router } from "express"
import { getProcessInfo, getRuntimeProcessList, renameProcess, setEnabled, setProcessProperty } from "jand-ipc"
import { RuntimeConfigData } from "srv/typings/interfaces"

export const router = Router()

router.get('/all', async (req: Request, res: Response) => {
    res.json(await getRuntimeProcessList())
})

router.patch('/:name/runconfig', async(req, res) => {
    try {
        const data = validateRequestBody<RuntimeConfigData>(
            req.body,
            {
                enabled: {
                    type: 'boolean'
                },
                autorestart: {
                    type: 'boolean'    
                }
            }
            )
            
        if(!Object.keys(data).length) return apiError(req, res, 400, "No valid fields provided")

        console.log(data)
    
        if(data.hasOwnProperty('enabled')) {
            await setEnabled(req.params.name, data.enabled)
        }
    
        if(data.hasOwnProperty('autorestart')) {
            //TODO: body.autorestart will not work as jand deems it invalid
            //await setProcessProperty(req.params.name, 'AutoRestart', data.autorestart.toString())
        }
    
        res.json(await getProcessInfo(req.params.name))
    } catch(e) {
        console.error(e)
        if (e instanceof TypeError && e.message.startsWith('Field')) return apiError(req, res, 400, e.message)
        else return apiError(req, res, 500, 'Internal Server Error')
    }

})