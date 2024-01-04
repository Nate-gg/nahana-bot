/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUserPick } = require('../utils/dbSanta')
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
		const user = await interaction.client.users.fetch(myPick.Picked)

		const userEmbed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Your Sneaky Santa Has A Question!')
			.setDescription(question)
			.setThumbnail(
				'https://cdn.discordapp.com/attachments/1190153012136644638/1191529479185641612/de558f3110d42ef72a88ad3d7cefd9ad.jpg'
			)
			.addFields({
				name: ' ',
				value: 'You can answer this with </santa-answer:1192252897002528802>',
			})

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
