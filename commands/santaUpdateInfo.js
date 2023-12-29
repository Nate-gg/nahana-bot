/**
 * Update Santa User Info
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { updateSantaUserInfo } = require('../utils/database')
const { OK_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-update-my-info')
		.setDescription('Update Your Shipping Info')
		.addStringOption(option =>
			option.setName('name').setDescription('Shipping Name')
		)
		.addStringOption(option =>
			option.setName('street').setDescription('Shipping Address')
		)
		.addStringOption(option =>
			option.setName('city').setDescription('Shipping City')
		)
		.addStringOption(option =>
			option.setName('state').setDescription('Shipping State / Province')
		)
		.addStringOption(option =>
			option.setName('postal').setDescription('Shipping Postal Code')
		)
		.addStringOption(option =>
			option.setName('size').setDescription('Clothing Size Info')
		)
		.addStringOption(option =>
			option.setName('interests').setDescription('Stuff You Like')
		)
		.addStringOption(option =>
			option
				.setName('instructions')
				.setDescription('Special Shipping Instructions')
		),

	async execute(interaction) {
		const userObj = {
			name: interaction.options.getString('name'),
			address: interaction.options.getString('street'),
			city: interaction.options.getString('city'),
			state: interaction.options.getString('state'),
			zip: interaction.options.getString('postal'),
			size: interaction.options.getString('size'),
			interests: interaction.options.getString('interests'),
			instructions: interaction.options.getString('instructions'),
		}

		await updateSantaUserInfo(userObj, interaction.user.id)

		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Info Updated!')
			.setThumbnail(OK_IMG)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
