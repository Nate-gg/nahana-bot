/**
 * Update Santa User Info
 */

const { SlashCommandBuilder } = require('discord.js')
const { getSantaUserInfo } = require('../utils/dbSanta')
const { santaUserEmbed } = require('../utils/embeds')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-my-info')
		.setDescription('View Your Info'),

	async execute(interaction) {
		const userObj = await getSantaUserInfo(interaction.user.id)

		let user = interaction.guild.members.cache.get(userObj.id)

		const embed = santaUserEmbed(userObj, user)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
