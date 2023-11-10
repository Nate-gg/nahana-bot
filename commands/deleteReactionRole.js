const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js')

const {
	getReactionRoles,
	getReactionRole,
	removeReactionRole,
} = require('../utils/database')

const { OK_IMG, ERROR_IMG, ROLE_CHANNEL } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletereactionrole')
		.setDescription('Add A Reaction Roll')
		.addRoleOption(option =>
			option.setName('role').setDescription('Role').setRequired(true)
		),

	async execute(interaction) {
		const role = interaction.options.getRole('role')
		const isRole = await getReactionRole(role.id)

		if (isRole) {
			const roleRsp = await removeReactionRole(role.id)
			const rectionRoles = await getReactionRoles(roleRsp.embedId)

			const actionRows = []

			let i = 0
			let ii = -1
			for (const item of rectionRoles) {
				if (i === 0) {
					const buttonRow = new ActionRowBuilder()
					actionRows.push(buttonRow)
					ii++
				}

				const button = new ButtonBuilder()
					.setCustomId(`role_${item.role}`)
					.setLabel(item.roleTitle)
					.setStyle(ButtonStyle.Secondary)

				actionRows[ii].addComponents(button)

				i++
				if (i === 5) {
					i = 0
				}
			}

			const channel = interaction.client.channels.cache.get(ROLE_CHANNEL)
			const prevEmbed = await channel.messages.fetch(`${roleRsp.embedId}`)

			const newEmbed = new EmbedBuilder()
				.setColor('dc5308')
				.setTitle(
					`Select which ${roleRsp.sectionTitle} channels you'd like to see`
				)

			prevEmbed.edit({
				embeds: [newEmbed],
				components: actionRows,
			})

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('dc5308')
						.setTitle('Removed')
						.setThumbnail(OK_IMG)
						.setDescription('Role Removed'),
				],
				ephemeral: true,
			})
		} else {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('fb1919')
						.setTitle('Error')
						.setThumbnail(ERROR_IMG)
						.setDescription('Message Role Does Not Exist'),
				],
				ephemeral: true,
			})
		}
	},
}
