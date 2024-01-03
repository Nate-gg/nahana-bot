/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getPickedBy } = require('../utils/dbSanta')
const { OK_IMG } = require('../config/config.json')
const { santaDisallowDM } = require('../utils/fnSanta')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-answer')
		.setDescription('Respond To Your Sneaky Santa')
		.addStringOption(option =>
			option
				.setName('answer')
				.setDescription('Your Answer')
				.setRequired(true)
		),

	async execute(interaction) {
		const DM = await santaDisallowDM(interaction.user.id)

		if (DM.notAllowed) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const answer = interaction.options.getString('answer')
		const pickedMe = await getPickedBy(interaction.user.id)
		const user = await interaction.client.users.fetch(pickedMe.UserID)

		const userEmbed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('An Answer To Your Question!')
			.setDescription(answer)
			.setThumbnail(
				'https://cdn.discordapp.com/attachments/1190153012136644638/1191595167996710932/image.png'
			)

		user.send({
			embeds: [userEmbed],
		})

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Message Sent!')
			.setThumbnail(OK_IMG)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
