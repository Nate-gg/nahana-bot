/**
 * View Your Sneaky Santa Picks Info
 */

const { SlashCommandBuilder } = require('discord.js')
const { getSantaUserInfo, getUserPick } = require('../utils/dbSanta')
const { santaUserEmbed } = require('../utils/embeds')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-view-my-picks-info')
		.setDescription('View The Info Of Your Pick'),

	async execute(interaction) {
		const myPick = await getUserPick(interaction.user.id)

		const userObj = await getSantaUserInfo(myPick.Picked)
		let user = interaction.guild.members.cache.get(myPick.Picked)

		const embed = santaUserEmbed(userObj, user)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
