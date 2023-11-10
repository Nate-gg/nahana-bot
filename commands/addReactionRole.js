const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js')

const {
	getRoleSection,
	addReactionRole,
	getReactionRoles,
	getReactionRole,
} = require('../utils/database')

const { OK_IMG, ERROR_IMG, ROLE_CHANNEL } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addreactionrole')
		.setDescription('Add A Reaction Roll')
		.addStringOption(option =>
			option
				.setName('messageid')
				.setDescription('Message ID To Add Role To')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Title Of Reaction Role')
				.setRequired(true)
		)
		.addRoleOption(option =>
			option.setName('role').setDescription('Role').setRequired(true)
		),

	async execute(interaction) {
		const messageid = interaction.options.getString('messageid')
		const title = interaction.options.getString('title')
		const role = interaction.options.getRole('role')

		const isEmbed = await getRoleSection(messageid)

		if (isEmbed) {
			/** ===== make sure the role isnt in use */

			const isRole = await getReactionRole(role.id)

			if (isRole) {
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor('fb1919')
							.setTitle('Error')
							.setThumbnail(ERROR_IMG)
							.setDescription(
								'This Reaction Role Already Exists'
							),
					],
					ephemeral: true,
				})
			} else {
				/** ===== db calls to insert the reaction, get the section info, and get all roles */
				await addReactionRole(messageid, title, role.id)
				const roleSectionRsp = await getRoleSection(messageid)
				const rectionRoles = await getReactionRoles(messageid)
				const actionRows = []

				/** ===== button builder. loop all the reactions to add the buttons */

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

				/** ===== get the message to edit */
				const channel =
					interaction.client.channels.cache.get(ROLE_CHANNEL)
				const prevEmbed = await channel.messages.fetch(messageid)

				const newEmbed = new EmbedBuilder()
					.setColor('dc5308')
					.setTitle(
						`Select which ${roleSectionRsp.sectionTitle} channels you'd like to see`
					)

				prevEmbed.edit({
					embeds: [newEmbed],
					components: actionRows,
				})
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor('dc5308')
							.setTitle('Added')
							.setThumbnail(OK_IMG)
							.setDescription('Role Added'),
					],
					ephemeral: true,
				})
			}
		} else {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('fb1919')
						.setTitle('Error')
						.setThumbnail(ERROR_IMG)
						.setDescription('Message ID Does Not Exist'),
				],
				ephemeral: true,
			})
		}
	},
}
