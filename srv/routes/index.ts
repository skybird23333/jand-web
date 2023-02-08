import { Router, Request, Response, Errback, NextFunction, json } from "express";
import { apiError } from "../utils/apiError"
import morgan from 'morgan'
import cors from 'cors'
import { jandClient } from "../utils/jandClient";

export const apiRouter = Router()

apiRouter.use(morgan(':method :url :status - :response-time ms'))
apiRouter.use(json())

apiRouter.use('*', (req:Request, res:Response, next:NextFunction) => {
    // @ts-ignore
    console.log(jandClient.requestQueue)
    next()
})

apiRouter.use('/process', require('./process').router)
apiRouter.use('/create', require('./create').router)
apiRouter.use('/daemon', require('./daemon').router)
apiRouter.use('/console', require('./console').router)
apiRouter.use('/status', require('./status').router)

apiRouter.get('/', (req:Request, res:Response) => {
    res.json({message: 'Hello World!'})
})

apiRouter.all('*', (req:Request, res:Response) => {
    apiError(req, res, 404, 'Endpoint not found')
})
    

apiRouter.use(function (err:Errback, req:Request, res:Response, next:NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    console.log('API ERROR:' + err)
    apiError(req, res, 500, 'Internal Server Error')
})