/**
 * Add User To Sneaky Santa
 */

const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require('discord.js')
const { checkActiveDrawing, addSantaDrawing } = require('../utils/dbSanta')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')
const { disallowDM } = require('../utils/fnGlobal')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-start')
		.setDescription('Starts A Drawing')
		.addStringOption(option =>
			option.setName('year').setDescription('YYYY').setRequired(true)
		),

	async execute(interaction) {
		const DM = disallowDM(interaction.guildId)
		if (DM) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const year = interaction.options.getString('year')

		const isActive = await checkActiveDrawing()

		const embed = new EmbedBuilder().setColor('dc5308')

		if (isActive) {
			embed
				.setTitle('Error')
				.setDescription(
					'A Drawing Is Already Active. Please Close It First'
				)
				.setThumbnail(ERROR_IMG)
		} else {
			const drawing = await addSantaDrawing(year)

			drawing.map(item => {
				let user = interaction.guild.members.cache.get(item.UserID)

				const confirm = new ButtonBuilder()
					.setCustomId('santaNotIn')
					.setLabel('Nah, Not This Year')
					.setStyle(ButtonStyle.Danger)

				const cancel = new ButtonBuilder()
					.setCustomId('santaIn')
					.setLabel('IM IN!')
					.setStyle(ButtonStyle.Success)

				const row = new ActionRowBuilder().addComponents(
					confirm,
					cancel
				)

				let DM = new EmbedBuilder()
					.setColor('dc5308')
					.setTitle(`🎁🎄 It's Sneaky Santa Time 🎄🎁`)
					.setDescription(
						`It's that special time of the year again!\r\rSNEAKY SANTA!!!\r\rBut ... Before we begin, I need to know who's participating. \r\rAre you in?`
					)
					.setThumbnail(
						'https://cdn.discordapp.com/attachments/1190153012136644638/1190671075034533888/image.png'
					)

				// user.send({ embeds: [DM], components: [row] })
			})

			embed
				.setTitle('Started!')
				.setThumbnail(OK_IMG)
				.setDescription(
					`DMs are now going out to check who's playing!!`
				)
		}

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
