const jand = require('jand-ipc')
const express = require('express')

const app = new express()
app.set('view engine', 'ejs')

app.use('/', express.static('public'))

app.get('/', async (req, res) => {
    const processes = await jand.getRuntimeProcessList()
    const status = await jand.getDaemonStatus()
    const pid = process.pid
    res.render('pages/home', { processes: processes, status: status, pid: pid })
})

async function run() {
    await jand.connect()
    app.listen(3000)
    console.log('App is ready')
}

run()