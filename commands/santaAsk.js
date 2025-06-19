/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUserPick, askQuestion } = require('../utils/dbSanta')
const { OK_IMG } = require('../config/config.json')
const { santaDisallowDM } = require('../utils/fnSanta')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-ask')
		.setDescription('Ask Your Pick A Questions')
		.addStringOption(option =>
			option
				.setName('question')
				.setDescription('Your Question')
				.setRequired(true)
		),

	async execute(interaction) {
		const DM = await santaDisallowDM(interaction.user.id)

		if (DM.notAllowed) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const question = interaction.options.getString('question')
		const myPick = await getUserPick(interaction.user.id)

		await askQuestion(interaction.user.id, myPick.Picked, question)

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
