import { apiError } from "../modules/apiError"
import validateRequestBody from "../utils/validate-request-body"
import { NextFunction, Request, Response, Router } from "express"
import { getProcessInfo, getRuntimeProcessList, renameProcess, restartProcess, setEnabled, setProcessProperty, stopProcess } from "jand-ipc"
import { RenameProcessData, RuntimeConfigData } from "srv/typings/interfaces"

export const router = Router()

router.get('/all', async (req: Request, res: Response) => {
    res.json(await getRuntimeProcessList())
})

router.use('/:name/*', async (req: Request, res: Response, next: NextFunction) => {
    // check if process exists
    const name = req.params.name
    if(!name) next()
    if(!await getProcessInfo(name)) {
        apiError(req, res, 404, 'Process not found')
    }
    next()
})


router.post('/:name/edit', async (req, res) => {
    try {        
        const { name } = req.params
        
        const data = validateRequestBody<RenameProcessData>(
            req.body,
            {
                name: {
                    type: 'string'
                }
            }
            )
            
            if (!Object.keys(data).length) return apiError(req, res, 400, "No valid fields provided")
            
            const newName = data.name
            
            await renameProcess(name, newName)
            
            res.json(await getProcessInfo(newName))
        } catch (e) {
            console.error(e)
            if (e instanceof TypeError && e.message.startsWith('Field')) return apiError(req, res, 400, e.message)
            else return apiError(req, res, 500, 'Internal Server Error')
        }
    })
    
router.patch('/:name/runconfig', async (req, res) => {
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
            
            if (!Object.keys(data).length) return apiError(req, res, 400, "No valid fields provided")
            
            
            console.log(data)
            
            if (data.hasOwnProperty('enabled')) {
                await setEnabled(req.params.name, data.enabled)
            }
            
        if (data.hasOwnProperty('autorestart')) {
            //TODO: body.autorestart will not work as jand deems it invalid
            //await setProcessProperty(req.params.name, 'AutoRestart', data.autorestart.toString())
        }
        
        res.json(await getProcessInfo(req.params.name))
        
    } catch (e) {
        console.error(e)
        if (e instanceof TypeError && e.message.startsWith('Field')) return apiError(req, res, 400, e.message)
        else return apiError(req, res, 500, 'Internal Server Error')
    }
    
})

//stop a process
router.post('/:name/stop', async (req, res) => {
    try {
        await stopProcess(req.params.name)
        res.json(await getProcessInfo(req.params.name))
    } catch (e) {
        console.error(e)
        return apiError(req, res, 500, 'Internal Server Error')
    }
})

router.post('/:name/restart', async (req, res) => {
    try {
        await restartProcess(req.params.name)
        res.json(await getProcessInfo(req.params.name))
    } catch (e) {
        console.error(e)
        return apiError(req, res, 500, 'Internal Server Error')
    }
})

router.get('/:name/', async (req: Request, res: Response) => {
    const { name } = req.params
    res.json(await getProcessInfo(name))
})