'use strict'

// Discord Libs
const { client, Discord } = require('./discord')
client.commands = new Discord.Collection()

//Packages
const fs = require('fs')
const { DateTime } = require('luxon')

//Local Files
const { prefix, token, errorImg } = require('./config/config.json')
const { startUp, rsp } = require('./functions')

//Import all the commands and set them
const cmdFiles = fs.readdirSync('./cmd').filter(file => file.endsWith('.js'))

for (const file of cmdFiles) {
	const cmd = require(`./cmd/${file}`)

	client.commands.set(cmd.name, cmd)
}

client.on('ready', startUp)

client.on('message', message => {
	//set up the bot to receive commands
	if (!message.content.startsWith(prefix) || message.author.bot) return
	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const cmdName = args.shift().toLowerCase()

	if (!client.commands.has(cmdName)) return
	const cmd = client.commands.get(cmdName)

	//check if the command requires roles and check against the users roles
	if (cmd.roles) {
		let hasRole = false

		if (!Array.isArray(cmd.roles)) {
			return message.channel.send(
				rsp('Something Broke ... Tell Nahana', errorImg)
			)
		}
		cmd.roles.map(role => {
			if (message.member.roles.cache.has(role)) {
				hasRole = true
			}
		})

		if (!hasRole) {
			return message.channel.send(
				rsp(
					'You don`t have this power.',
					'https://cdn.discordapp.com/emojis/595733409427488768.png?v=1'
				)
			)
		}
	}

	//check if the command has channel restrictions
	if (cmd.channels) {
		let inChannel = false

		if (!Array.isArray(cmd.channels)) {
			return message.channel.send(
				rsp('Something Broke ... Tell Nahana', errorImg)
			)
		}
		cmd.channels.map(channel => {
			if (message.channel.id === channel) {
				inChannel = true
			}
		})

		if (!inChannel) {
			return
		}
	}

	//check if the command needs arguments
	if (cmd.args && !args.length) {
		let reply = 'I need More Info :/'
		if (cmd.usage) {
			reply = rsp(cmd.usage, errorImg)
		}
		return message.channel.send(reply)
	}

	try {
		cmd.execute(message, args)
	} catch (error) {
		console.error(error)
		return message.channel.send(
			rsp('Something Broke ... Tell Nahana', errorImg)
		)
	}
})

client.login(token)
