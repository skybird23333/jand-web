import express from 'express'
import { apiRouter } from './routes'
import fallback from 'express-history-api-fallback'
import { jandClient } from './modules/jandClient'
import cors from 'cors'

const app = express()

process.on('uncaughtException', (e) => {
    if(e instanceof Error) {
        if(e.message.includes('ENOENT')) {
            app.all('/api/*', (req, res) => {
                res.status(503).json({error: 'jand-conn-fail'})
            })
        }
    }
})

async function run() {
    connectToJanD()
    
    app.set('view engine', 'ejs')
    app.use(fallback('index.html', { root: 'dist-app' }))
    app.use(cors())
    app.use('/', express.static('dist-app'))
    
    app.listen(process.env.PORT || 3000)
    console.log('App is ready at http://localhost:' + (process.env.PORT || 3000))
}

async function connectToJanD() {
    try {
        await jandClient.connect()
        app.use('/api', apiRouter)
        jandClient.subscribe(["errlog","outlog","procadd","procdel","procren","procstart","procstop"])
    } catch(e) {
        if(e instanceof Error) {
            if(e.message.includes('ENOENT')) {
                app.all('/api/*', (req, res) => {
                    res.status(503).json({error: 'jand-conn-fail'})
                })
            } else {
                console.error(e)
                app.all('/api/*', (req, res) => {
                    res.status(503).json({error: 'unknown'})
                })
            }
        }
    }

}

run()