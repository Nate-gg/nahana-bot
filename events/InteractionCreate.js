/**
 * =====
 * ===== INTERACTION CREATE - SLASH COMMANDS
 * ===== Runs each slash command
 * =====
 */

const {
	Events,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js')

const { OK_IMG } = require('../config/config.json')

const { clickSantaNotIn, clickSantaIn } = require('../utils/btnSanta')
const {
	getAllDrawings,
	getDrawingPicks,
	setPackageReceived,
	answerQuestion,
} = require('../utils/dbSanta')
const {
	buildHistoryList,
	packageList,
	questionList,
} = require('../utils/fnSanta')

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
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

			if (id.match(/santaHistory/)) {
				const split = id.split('-')
				const year = parseInt(split[1])

				const drawings = await getAllDrawings()
				const currentDrawing = drawings.find(item => item.Year === year)
				const current = await getDrawingPicks(currentDrawing.ID)

				const historyObj = buildHistoryList(
					year,
					current,
					drawings,
					interaction
				)

				await interaction.update({
					embeds: [historyObj.embed],
					components: [historyObj.row],
				})
			}

			if (id.match(/santaPackage/)) {
				const split = id.split('-')
				const userID = split[1]
				const page = parseInt(split[2])
				const packageObj = await packageList(userID, page)

				await interaction.update({
					embeds: [packageObj.embed],
					components: [packageObj.row],
				})
			}
			if (id.match(/santaQuestion/)) {
				const split = id.split('-')
				const userID = split[1]
				const page = parseInt(split[2])
				const questionObj = await questionList(userID, page)

				await interaction.update({
					embeds: [questionObj.embed],
					components: [questionObj.row],
				})
			}
			if (id.match(/answerQuestion/)) {
				console.log(id)
				const split = id.split('||||')
				const messageID = split[1]
				const question = split[2]

				const modal = new ModalBuilder()
					.setCustomId(messageID)
					.setTitle('Answer A Question')

				const hobbiesInput = new TextInputBuilder()
					.setCustomId('answer')
					.setLabel(question)
					.setStyle(TextInputStyle.Paragraph)

				const secondActionRow = new ActionRowBuilder().addComponents(
					hobbiesInput
				)

				modal.addComponents(secondActionRow)
				await interaction.showModal(modal)
			}

			if (id.match(/santaReceived/)) {
				const split = id.split('_')
				const packageID = split[1]
				const received = split[2] === 'false' ? false : true
				const userID = split[3]
				const page = split[4]

				await setPackageReceived(packageID, received)

				const packageObj = await packageList(userID, parseInt(page))

				await interaction.update({
					embeds: [packageObj.embed],
					components: [packageObj.row],
				})
			}

			switch (id) {
				case 'santaNotIn':
					clickSantaNotIn(interaction)
					break

				case 'santaIn':
					clickSantaIn(interaction)
					break
			}
		}

		if (interaction.isModalSubmit()) {
			const answer = interaction.fields.getTextInputValue('answer')
			await answerQuestion(interaction.customId, answer)

			const embed = new EmbedBuilder()
				.setColor('dc5308')
				.setTitle('Message Sent!')
				.setThumbnail(OK_IMG)

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			})
		}
	},
}
