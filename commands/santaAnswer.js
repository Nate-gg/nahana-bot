/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder } = require('discord.js')
const { santaDisallowDM, questionList } = require('../utils/fnSanta')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-answer')
		.setDescription('Respond To Your Sneaky Santa'),

	async execute(interaction) {
		const DM = await santaDisallowDM(interaction.user.id)

		if (DM.notAllowed) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const userID = interaction.user.id
		const packageObj = await questionList(userID, 0)

		await interaction.reply({
			embeds: [packageObj.embed],
			components: packageObj.row ? [packageObj.row] : [],
			ephemeral: true,
		})

		// const answer = interaction.options.getString('answer')
		// const pickedMe = await getPickedBy(interaction.user.id)
		// const user = await interaction.client.users.fetch(pickedMe.UserID)

		// user.send({
		// 	embeds: [userEmbed],
		// })

		// const embed = new EmbedBuilder()
		// 	.setColor('dc5308')
		// 	.setTitle('Message Sent!')
		// 	.setThumbnail(OK_IMG)

		// await interaction.reply({
		// 	embeds: [embed],
		// 	components: [row],
		// 	ephemeral: true,
		// })
	},
}
