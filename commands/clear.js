// ========= Clears Messages

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const wait = require('util').promisify(setTimeout)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears Messages')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(option =>
			option
				.setName('number')
				.setDescription('Number of messages to clear')
				.setRequired(true)
		),

	async execute(interaction) {
		const TO_DELETE = interaction.options.getInteger('number')
		interaction.channel.bulkDelete(TO_DELETE, true)
		await interaction.reply(`${TO_DELETE} messages removed!`)
		await wait(5000)
		await interaction.deleteReply()
	},
}
