const { EmbedBuilder } = require('discord.js')
const { setSantaParticipating } = require('./dbSanta')

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

	const userEmbed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`YAY You're In!!!!`)
		.setDescription(
			`Once everyone answers we'll draw names!\r\rIn the meantime, you can make sure your info is up to date with </santa-view-my-info:1192252897342259271>`
		)
		.setThumbnail(
			'https://cdn.discordapp.com/attachments/1190153012136644638/1192318419186487338/c3d65acf51c44d9c6e1f5a20427e5b3f.gif'
		)

	await interaction.update({
		embeds: [userEmbed],
		components: [],
	})
}
