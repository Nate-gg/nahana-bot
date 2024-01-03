/**
 * View Sneaky Santa Progress
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { santaGetProgress } = require('../utils/dbSanta')
const { disallowDM } = require('../utils/fnGlobal')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-progress')
		.setDescription('View The Gifting Progress'),

	async execute(interaction) {
		const DM = disallowDM(interaction.guildId)
		if (DM) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		let progress = await santaGetProgress()
		progress.sort(
			(a, b) =>
				b['NB-SantaPackages'].length - a['NB-SantaPackages'].length
		)

		let description = ''

		progress.map(item => {
			let received = item['NB-SantaPackages'].filter(p => p.Receive)
			let packages = item['NB-SantaPackages']

			description += `<@${item.UserID}> Has Recived ${received.length} of ${packages.length} Gifts\r\r`
		})

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Gifting Progress')
			.setDescription(description)
			.setThumbnail(
				'https://cdn.discordapp.com/attachments/759209717402435634/1191963917904265226/images.jpg'
			)

		await interaction.reply({
			embeds: [embed],
		})
	},
}
