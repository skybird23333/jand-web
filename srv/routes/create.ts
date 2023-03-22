import { NextFunction, Request, Response, Router } from "express"
import { apiError } from "../utils/apiError"
import fs from 'node:fs'
import resursivelyCheckWritable, { RecursiveLimitError } from "../utils/recursively-check-writable"

export const router = Router()

router.post('/checkdir', async (req: Request, res: Response) => {
    if(!req.body.dir) return apiError(req, res, 400, 'No directory provided')
    const dir = req.body.dir
    const exists = fs.existsSync(dir)
    if(!exists) {
        //Directory doesn't exist, check if a writable parent directory exists
        try {
            const parentWritable = await resursivelyCheckWritable(dir)
            return res.json({writable: false, exists, parentWritable})
        } catch(e) {
            if(e instanceof RecursiveLimitError) {
                return res.json({writable: false, exists, parentWritable: false})
            }
            return apiError(req, res, 500, 'Internal Server Error')
        }
    }
    //check if the current directory is writable
    fs.access(dir, fs.constants.W_OK, function(err) {
        if(err){
            // Directory is not writable
            return res.json({writable: false, exists})
        }
        else {
            //Directory exists and is writable
            res.json({writable: true, exists})
        }
    });
})