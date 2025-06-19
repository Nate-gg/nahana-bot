/**
 * =====
 * ===== CLIENT READY EVENT
 * ===== Sets the bot's status on start up
 * =====
 */

const { Events } = require('discord.js')
const { santaRealtime } = require('../utils/dbSanta')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log('client ready')
		santaRealtime(client)
	},
}
