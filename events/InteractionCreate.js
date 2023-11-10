/**
 * =====
 * ===== INTERACTION CREATE - SLASH COMMANDS
 * ===== Runs each slash command
 * =====
 */

const { Events, EmbedBuilder } = require('discord.js')

const { OK_IMG } = require('../config/config.json')

// const sqlite3 = require('sqlite3').verbose()

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		// if (!interaction.isChatInputCommand()) return

		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			)

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				)
				return
			}

			try {
				await command.execute(interaction)
			} catch (error) {
				console.error(error)
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				})
			}
		}

		if (interaction.isButton()) {
			let id = interaction.customId

			/** ROLE CONTROL */
			if (id.match(/role/)) {
				const split = id.split('_')
				const roleId = split[1]

				if (interaction.member.roles.cache.find(r => r.id === roleId)) {
					interaction.member.roles.remove(roleId)

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

					// Your code
				} else {
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
					interaction.member.roles.add(roleId)
				}
			}
			// const button = interaction.client.buttons.get(interaction.customId)

			// console.log(button)
		}
	},
}
