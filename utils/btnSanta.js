const { EmbedBuilder } = require('discord.js')
const { santaUserEmbed } = require('./embeds')
const { setSantaParticipating, getSantaUserInfo } = require('./dbSanta')

exports.clickSantaNotIn = async interaction => {
	await setSantaParticipating(false, interaction.user.id)

	await interaction.update({
		embeds: [
			new EmbedBuilder()
				.setColor('dc5308')
				.setTitle('Too Bad 😢')
				.setDescription(`We'll miss you, but we understand.`),
		],
		components: [],
	})
}

exports.clickSantaIn = async interaction => {
	await setSantaParticipating(true, interaction.user.id)
	const userObj = await getSantaUserInfo(interaction.user.id)
	await interaction.update({
		content:
			"YAY!! You're In!! \r\rPlease make sure your info has not changed. You can update this at anytime by running `/santa-update-my-info`",
		embeds: [santaUserEmbed(userObj, interaction.user)],
		components: [],
	})
}
