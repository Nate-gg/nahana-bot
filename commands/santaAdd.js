/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { addSantaUser } = require('../utils/dbSanta')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')
const { disallowDM } = require('../utils/fnGlobal')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-add')
		.setDescription('Add A Sneaky Santa User')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User To Add')
				.setRequired(true)
		),

	async execute(interaction) {
		const DM = disallowDM(interaction.guildId)
		if (DM) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const user = interaction.options.getUser('user')
		const userAdd = await addSantaUser(user.id)
		const roleId = '764718890033872936'

		const embed = new EmbedBuilder().setColor('dc5308')

		if (!userAdd.error) {
			const guild = interaction.guild
			const member = guild.members.cache.get(
				interaction.options.getUser('user').id
			)
			const role = guild.roles.cache.find(role => role.id === roleId)
			member.roles.add(role)

			embed.setTitle('Added!').setThumbnail(OK_IMG)
		} else {
			embed
				.setTitle('Error')
				.setDescription(userAdd.message)
				.setThumbnail(ERROR_IMG)
		}

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
