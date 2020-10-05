
const {mkdirSync, appendFileSync, existsSync} = require('fs')
const {spawn, spawnSync} = require('child_process')

const express = require('express')
const app = express()
const port = 80


const usage = `Usage:
	https://browserify.us/require/package-name
	https://browserify.us/require/variable-name=npm-package-name
`

mkdirSync('data')


app.get('/', (req, res) => {
	res.type('text/plain')
	res.send(usage)
})

app.get('/require/:data', (req, res) => {
	const data = req.params.data
	const file = `data/${data}`
	const m = data.match(/^(\w+)(?:=([\w\-]+))?$/)
	if (m && existsSync(file)) {
		res.type('text/javascript')
		return res.sendFile(file, {root: __dirname})
	}
	if (m && m.length === 3) {
		let [__, variable, package = variable] = m
		let npm = `npm install ${package}`
		spawnSync('/bin/bash', ['-c', npm])
		let cmd = `echo '${variable} = require("${package}")' |node_modules/.bin/browserify - |tee ${file}`
		appendFileSync('data/log.txt', `${cmd}\n`, 'utf8') 
		let child = spawn('/bin/bash', ['-c', cmd])
		res.type('text/javascript')
		return child.stdio[1].pipe(res)
	}
	res.type('text/plain')
	res.send(usage)
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
