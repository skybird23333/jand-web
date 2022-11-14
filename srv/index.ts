import jand from 'jand-ipc'
import express from 'express'
import { apiRouter } from './routes'
import fallback from 'express-history-api-fallback'
import { jandClient } from './modules/jandClient'

const app = express()
app.set('view engine', 'ejs')

app.use('/', express.static('dist-app'))
app.use('/api', apiRouter)

app.use(fallback('index.html', { root: 'dist-app' }))

async function run() {
    await jandClient.connect()
    app.listen(3000)
    console.log('App is ready at http://localhost:3000')
}

run()