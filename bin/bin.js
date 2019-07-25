#! /usr/bin/env node

const fs = require('fs')
const hasFlag = require('has-flag')
const shelljs = require('shelljs')

const argv = process.argv
const config = require('../config')
let target = argv[2]

if (!argv[2]) {
	console.log('参数错误')
	process.exit()
}
// make torrent
if (/\.mkv$/.test(target)) {
	shelljs.exec(`mktorrent -v -p -l 23 -a ${config.announce} -o ${config.workDir}/${target}.torrent ${target}`)
} else {
	// unrar if necessary
	shelljs.exec(`unrar e ${target}`)
	target = shelljs.ls('*.mkv')[0]
	if (!/x264/.test(target)) {
		const pwd = shelljs.exec('pwd').split('/')
		const properName = pwd[pwd.length - 1]
		const newTarget = `${properName.trim()}.mkv`
		shelljs.mv(target, newTarget)
		target = newTarget
	}
	shelljs.exec(`mktorrent -v -p -l 23 -a ${config.announce} -o ${config.workDir}/${target}.torrent ${target}`)
}

// make screenshots
shelljs.exec(`ffmpeg -y -ss 1000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s1.png`)
shelljs.exec(`ffmpeg -y -ss 1500  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s2.png`)
shelljs.exec(`ffmpeg -y -ss 2000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s3.png`)
shelljs.exec(`ffmpeg -y -ss 3000  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s4.png`)
shelljs.exec(`ffmpeg -y -ss 3600  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s5.png`)
shelljs.exec(`ffmpeg -y -ss 4500  -i  ${target} -f  image2  -vframes 1 ${config.workDir}/${target}-s6.png`)

// mediainfo
const mediainfo = shelljs.exec(`mediainfo ${target}`, { silent:true }).stdout
fs.writeFileSync(`${config.workDir}/${target}-mediainfo.txt`, mediainfo)
shelljs.mv(target, config.moveDir)

// serve static files 
shelljs.cd(config.workDir)
const child = shelljs.exec('serve -l 9006', { async: true })
child.stdout.on('data', function(data) {
})
