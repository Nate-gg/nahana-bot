/**
 * Places Mike Could be
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { addMikeLocation } = require('../utils/database')
const { OK_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('isawmikeyb')
		.setDescription('Help Us Find Mike')
		.addStringOption(option =>
			option
				.setName('where')
				.setDescription('Where Did You See Mike?')
				.setRequired(true)
		),

	async execute(interaction) {
		/**
		 * add the new place to look
		 */

		const response = interaction.options.getString('where')
		await addMikeLocation(response)

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Added!')
			.setThumbnail(OK_IMG)
			.setDescription(response)

		await interaction.reply({
			embeds: [embed],
		})
	},
}
