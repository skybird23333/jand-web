import express from 'express'
import { apiRouter } from './routes'
import fallback from 'express-history-api-fallback'
import { jandClient } from './modules/jandClient'

const app = express()
app.set('view engine', 'ejs')

app.use(fallback('index.html', { root: 'dist-app' }))
app.use('/', express.static('dist-app'))
app.use('/api', apiRouter)

async function run() {
    try {
        await jandClient.connect()
        // @ts-ignore
        jandClient.subscribe(["errlog","outlog","procadd","procdel","procren","procstart","procstop"])
        app.listen(process.env.PORT || 3000)
        console.log('App is ready at http://localhost:' + (process.env.PORT || 3000))

    } catch(e) {
        if(e instanceof Error) {
            if(e.message.includes('ENOENT')) {
                app.all('*', (req, res) => {
                    res.status(503).json({error: 'jand-conn-fail'})
                })
            } else {
                console.error(e)
                app.all('*', (req, res) => {
                    res.status(503).json({error: 'unknown'})
                })
            }
        }
    }
}

run()