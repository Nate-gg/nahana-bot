/**
 * Add User Restriction
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { addSantaRestriction } = require('../utils/dbSanta')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-add-restriction')
		.setDescription('Add A Pull Restriction')
		.addUserOption(option =>
			option
				.setName('user-one')
				.setDescription('User 1 To Restrict')
				.setRequired(true)
		)
		.addUserOption(option =>
			option
				.setName('user-two')
				.setDescription('User 2 To Restrict')
				.setRequired(true)
		),

	async execute(interaction) {
		const userOne = interaction.options.getUser('user-one')
		const userTwo = interaction.options.getUser('user-two')

		const resp = await addSantaRestriction(userOne.id, userTwo.id)
		const embed = new EmbedBuilder().setColor('dc5308').setTitle('Added')

		if (!resp.error) {
			embed.setTitle('Added!').setThumbnail(OK_IMG)
		} else {
			embed
				.setTitle('Error')
				.setDescription(resp.message)
				.setThumbnail(ERROR_IMG)
		}

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
