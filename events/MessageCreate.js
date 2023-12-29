/**
 * =====
 * ===== CLIENT READY EVENT
 * ===== Sets the bot's status on start up
 * =====
 */

const { Events } = require('discord.js')

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(client) {
		/**
		 * TO DO
		 * IF NOT GUILD ITS A DM
		 * SET UP DMS FOR SANTA
		 */
		// console.log(client.guildId)
	},
}
