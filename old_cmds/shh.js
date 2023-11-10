/**
 * Server Mute and Deafen Yourself
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')

const { RSP } = require('../functions')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shh')
		.setDescription('Some Quiet Time'),

	async execute(interaction) {
		/**
		 * deafen & mute
		 */
		if (interaction.member.voice.channel) {
			interaction.member.voice.setMute(true)
			interaction.member.voice.setDeaf(true)

			await interaction.reply({
				embeds: [RSP(`It's quiet now`, OK_IMG)],
			})
		} else {
			await interaction.reply({
				embeds: [RSP(`You're not in voice chat`, ERROR_IMG)],
			})
		}
	},
}
