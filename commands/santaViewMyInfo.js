/**
 * Update Santa User Info
 */

const { SlashCommandBuilder } = require('discord.js')
const { getSantaUserInfo } = require('../utils/dbSanta')
const { santaUserEmbed } = require('../utils/embeds')
const { santaDisallowDM } = require('../utils/fnSanta')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-my-info')
		.setDescription('View Your Info'),

	async execute(interaction) {
		const DM = await santaDisallowDM(interaction.user.id)

		if (DM.notAllowed) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const userObj = await getSantaUserInfo(interaction.user.id)

		let user = interaction.guild.members.cache.get(userObj.UserID)

		const embed = santaUserEmbed(userObj, user.user)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
