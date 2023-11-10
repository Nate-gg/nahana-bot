/**
 * Where's Mike?!?!?!?!
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { findMike } = require('../utils/database')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whereismikeyb')
		.setDescription('Help Us Find Mike'),

	async execute(interaction) {
		/**
		 * get a random response
		 */

		const location = await findMike()

		const embed = new EmbedBuilder()
			.setColor('fb1919')
			.setTitle('Mike Is')
			.setThumbnail(
				'https://cdn.discordapp.com/attachments/1050439915378331668/1073380832829509652/clipart42210651.png'
			)
			.setDescription(location)

		await interaction.reply({
			embeds: [embed],
		})
	},
}
