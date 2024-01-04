/**
 * Add User To Sneaky Santa
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUserPick } = require('../utils/dbSanta')
const { OK_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-help')
		.setDescription('Get Help With Sneaky Santa Commands'),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Sneaky Santa Commands!')
			.addFields(
				{
					name: 'View Your Info',
					value: '</santa-view-my-info:1192252897342259271>',
					inline: true,
				},
				{
					name: 'Update My Info',
					value: '</santa-update-my-info:1192252897002528807>',
					inline: true,
				},
				{
					name: `\u200B`,
					value: `\u200B\r\u200B`,
					inline: true,
				}
			)
			.addFields(
				{
					name: 'Ask Your Pick A Question',
					value: '</santa-ask:1192252897002528803>',
					inline: true,
				},
				{
					name: 'Answer A Question Asked',
					value: '</santa-answer:1192252897002528802>',
					inline: true,
				},
				{
					name: `\u200B`,
					value: `\u200B\r\u200B`,
					inline: true,
				}
			)
			.addFields(
				{
					name: 'Add A Sent Package',
					value: '\u200B\r</santa-add-package:1192252897002528799>',
					inline: true,
				},
				{
					name: 'View Your Packages and \r Mark Package Received',
					value: '</santa-view-packages:1192252897342259272>',
					inline: true,
				},
				{
					name: `\u200B`,
					value: `\u200B\r\u200B\r\u200B`,
					inline: true,
				}
			)
			.addFields({
				name: 'View The Progress of Sent / Received Gifts',
				value: '</santa-view-progress:1192252897342259274>\r\u200B',
			})
			.addFields({
				name: 'View Previous Drawings',
				value: '</santa-view-history:1192252897002528805>\r\u200B',
			})

			.setThumbnail(
				'https://cdn.discordapp.com/attachments/759209717402435634/1192268089954422804/ghows-IA-3328018b-282e-499a-94dd-61ee86323d97-c4e1bc9b.webp'
			)

		await interaction.reply({
			embeds: [embed],
		})
	},
}

// --
// --
// --
// -- santa-update-my-info
// --

// --
// --
