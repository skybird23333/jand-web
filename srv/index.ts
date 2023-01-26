import express from 'express'
import { apiRouter } from './routes'
import fallback from 'express-history-api-fallback'
import { jandClient } from './modules/jandClient'
import cors from 'cors'

const app = express()

process.on('uncaughtException', (e) => {
    if (e instanceof Error) {
        if (e.message.includes('ENOENT')) {
            console.error('[FATAL] Unable to connect to JanD Daemon. Please visit the app for more details.')
            app.all('/api/*', (req, res) => {
                res.status(503).json({ error: 'jand-conn-fail' })
            })
            app.use(fallback('index.html', { root: 'dist-app' }))
        }
    }
})

async function run() {
    app.use(cors())

    app.use('/', express.static('dist-app'))
    connectToJanD()
    
    
    console.log('App is ready at http://localhost:' + (process.env.PORT || 3000))

    app.listen(process.env.PORT || 3000)
}

async function connectToJanD() {
    try {
        await jandClient.connect()
        app.use('/api', apiRouter)
        app.use(fallback('index.html', { root: 'dist-app' }))
        jandClient.subscribe(["errlog", "outlog", "procadd", "procdel", "procren", "procstart", "procstop"])
    } catch (e) {
        if (e instanceof Error) {
            console.error('[FATAL] An unknown error occured while starting the server. Please visit the app for more details. Additional errors have been logged.')
            console.error(e)
            app.all('/api/*', (req, res) => {
                res.status(503).json({ error: 'unknown' })
            })
            app.use(fallback('index.html', { root: 'dist-app' }))
        }
    }

}

run()