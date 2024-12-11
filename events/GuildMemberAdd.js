/**
 * =====
 * ===== CLIENT READY EVENT
 * ===== Sets the bot's status on start up
 * =====
 */

const { Events } = require('discord.js')

module.exports = {
	name: Events.GuildMemberAdd,
	once: true,
	async execute(interaction) {
		console.log(interaction)
		const UID = interaction.user.id
		const member = interaction.guild.members.cache.get(UID)

		member.roles.add('1108914738513072188')
		// interaction.channels.cache.get('528964687824551938').send('Hello here!')
	},
}
