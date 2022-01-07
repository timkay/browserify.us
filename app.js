
const {mkdirSync, appendFileSync, existsSync} = require('fs')
const {spawn, spawnSync} = require('child_process')
const process = require('process')

const express = require('express')
const cors = require('cors')
const app = express()
const port = 80


const usage = `Usage:
	https://browserify.us/require/package-name
	https://browserify.us/require/variable-name=npm-package-name
`

try {
	mkdirSync('data')
} catch (e) {
}


app.use(cors())

app.get('/', (req, res) => {
    res.type('text/plain')
    res.send(usage)
})

app.get('/require/:data', (req, res) => {
    const data = req.params.data
    const file = `data/${data}`
    if (existsSync(file)) {
	res.type('text/javascript')
	return res.sendFile(file, {root: __dirname})
    }
    let packages = []
    let variables = []
    data.split(/,/).forEach(module => {
	const m = module.match(/^(\w+)(?:=([\w\-]+)(\@[\w\.]+)?)?$/)
	if (m && m.length === 4) {
	    let [__, variable, package = variable, version = ''] = m
	    variables.push(`${variable} = require("${package}")`)
	    packages.push(package + version)
	}
    })
    if (packages.length === 0) {
	res.type('text/plain')
	res.send(usage)
    }
    spawnSync('npm', ['install', ...packages])
    let cmd = `echo '${variables.join('\n')}' |node_modules/.bin/browserify --ignore-missing - |tee ${file}`
    appendFileSync('data/log.txt', `${cmd}\n`, 'utf8') 
    let child = spawn('/bin/ash', ['-c', cmd])
    res.type('text/javascript')
    return child.stdio[1].pipe(res)
})

const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('\nSIGINT: HTTP server closed');
    });
})

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('SIGKILL: HTTP server closed');
    });
})
