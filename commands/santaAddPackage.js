/**
 * Add Sneaky Santa Package
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUserPick, addPackage } = require('../utils/dbSanta')
const { OK_IMG } = require('../config/config.json')
const { santaDisallowDM } = require('../utils/fnSanta')
const { packageEmbed } = require('../utils/embeds')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-add-package')
		.setDescription('Let Your Pick Know They Have A Package Coming!')
		.addStringOption(option =>
			option
				.setName('date')
				.setDescription('When The Package Is Arriving')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('courier')
				.setDescription('Courier Service (FedEx, UPS, USPS, ETC)')
				.addChoices(
					{ name: 'FedEX', value: 'fedex' },
					{ name: 'USPS', value: 'usps' },
					{ name: 'UPS', value: 'ups' }
				)
		)
		.addStringOption(option =>
			option.setName('tracking').setDescription('Tracking Number')
		)
		.addStringOption(option =>
			option.setName('notes').setDescription('Notes')
		),

	async execute(interaction) {
		const DM = await santaDisallowDM(interaction.user.id)

		if (DM.notAllowed) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const date = interaction.options.getString('date')
		const courier = interaction.options.getString('courier')
		const tracking = interaction.options.getString('tracking')
		const notes = interaction.options.getString('notes')

		const myPick = await getUserPick(interaction.user.id)

		const toUser = await interaction.client.users.fetch(myPick.Picked)
		const from = interaction.user.id
		const to = myPick.Picked

		const userEmbed = packageEmbed(date, courier, tracking, notes)

		toUser.send({
			embeds: [userEmbed],
		})

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Package Added')
			.setDescription('Your Pick has been notified!')
			.setThumbnail(OK_IMG)

		await addPackage(from, to, date, courier, tracking, notes)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
