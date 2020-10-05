
const {appendFileSync} = require('fs')
const {spawn, spawnSync} = require('child_process')

const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/require/:data', (req, res) => {
	const data = req.params.data
	const m = data.match(/^(\w+)=([\w\-]+)$/)
	if (m.length === 3) {
		let npm = `npm install ${m[2]}`
		spawnSync('/bin/bash', ['-c', npm])
		let cmd = `echo '${m[1]} = require("${m[2]}")' |node_modules/.bin/browserify -`
		appendFileSync('data/log.txt', `${cmd}\n`, 'utf8') 
		let child = spawn('/bin/bash', ['-c', cmd])
		res.type('text/javascript')
		return child.stdio[1].pipe(res)
		return res.send(cmd)
	}
	res.type('text/plain')
	res.send(m.join('\n'))
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
