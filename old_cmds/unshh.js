/**
 * Server Unmute and Undeafen Yourself
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')

const { RSP } = require('../functions')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unshh')
		.setDescription('Back To The Grind'),

	async execute(interaction) {
		/**
		 * deafen & mute
		 */
		if (interaction.member.voice.channel) {
			interaction.member.voice.setMute(false)
			interaction.member.voice.setDeaf(false)

			await interaction.reply({
				embeds: [RSP(`It's no longer quiet`, OK_IMG)],
			})
		} else {
			await interaction.reply({
				embeds: [RSP(`You're not in voice chat`, ERROR_IMG)],
			})
		}
	},
}
