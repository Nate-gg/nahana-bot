/**
 * View Sneaky Santa History
 */

const { SlashCommandBuilder } = require('discord.js')
const { getAllDrawings, getDrawingPicks } = require('../utils/dbSanta')
const { buildHistoryList } = require('../utils/fnSanta')
const { disallowDM } = require('../utils/fnGlobal')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-history')
		.setDescription('See The Picks Over The Years'),

	async execute(interaction) {
		const DM = disallowDM(interaction.guildId)
		if (DM) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}
		const drawings = await getAllDrawings()
		const current = await getDrawingPicks(drawings[0].ID)

		const historyObj = buildHistoryList(
			drawings[0].Year,
			current,
			drawings,
			interaction
		)

		await interaction.reply({
			embeds: [historyObj.embed],
			components: [historyObj.row],
		})
	},
}
