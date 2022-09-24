import jand from 'jand-ipc'
import express from 'express'
import { apiRouter } from './routes'

const app = express()
app.set('view engine', 'ejs')

app.use('/', express.static('dist-app'))
app.use('/api', apiRouter)

async function run() {
    await jand.connect()
    app.listen(3000)
    console.log('App is ready')
}

run()