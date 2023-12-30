/**
 * Update Santa User Info
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { updateSantaUserInfo } = require('../utils/dbSanta')
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
			Name: interaction.options.getString('name'),
			Street: interaction.options.getString('street'),
			City: interaction.options.getString('city'),
			State: interaction.options.getString('state'),
			Zip: interaction.options.getString('postal'),
			Size: interaction.options.getString('size'),
			Interests: interaction.options.getString('interests'),
			Instructions: interaction.options.getString('instructions'),
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
