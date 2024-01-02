/**
 * Receive Sneaky Santa Package
 */

const { SlashCommandBuilder } = require('discord.js')

const { packageList } = require('../utils/fnSanta')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-packages')
		.setDescription('View Your Packages'),

	async execute(interaction) {
		const userID = interaction.user.id

		const packageObj = await packageList(userID, 0)

		await interaction.reply({
			embeds: [packageObj.embed],
			components: packageObj.row ? [packageObj.row] : [],
			ephemeral: true,
		})
	},
}
