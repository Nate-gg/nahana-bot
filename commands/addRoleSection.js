const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { addRoleSection } = require('../utils/database')
const { OK_IMG, ROLE_CHANNEL } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrolesection')
		.setDescription('Create A Role Assignment Section')
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Section Title')
				.setRequired(true)
		),

	async execute(interaction) {
		const title = interaction.options.getString('title')

		const embedReply = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle(`Section Added`)
			.setThumbnail(OK_IMG)

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle(`Select which ${title} channels you'd like to see`)

		await interaction.reply({
			embeds: [embedReply],
			ephemeral: true,
		})

		const channel = interaction.client.channels.cache.get(ROLE_CHANNEL)

		const message = await channel.send({ embeds: [embed] })
		await addRoleSection(message.id, title)
	},
}
