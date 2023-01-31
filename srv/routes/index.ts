import { Router, Request, Response, Errback, NextFunction, json } from "express";
import { apiError } from "../modules/apiError"
import morgan from 'morgan'
import cors from 'cors'

export const apiRouter = Router()

apiRouter.use(morgan(':method :url :status - :response-time ms'))
apiRouter.use(json())

//TODO: register endpoints
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