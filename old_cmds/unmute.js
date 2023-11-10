/**
 * Mute a user
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const { OK_IMG } = require('../config/config.json')

const { RSP } = require('../functions')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute A User')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User To Unmute')
				.setRequired(true)
		),

	async execute(interaction) {
		/**
		 * get the member and display name
		 */

		const MEMBER = interaction.options.getMember('user')
		const DISPLAY_NAME = MEMBER.nickname
			? MEMBER.nickname
			: MEMBER.user.username

		/**
		 * if the user is in voice mute their voice
		 */
		if (MEMBER.voice.channel) {
			MEMBER.voice.setMute(false)
		}

		/**
		 * add the mute role so they cannot type
		 */
		MEMBER.roles.remove('533028666746208267')

		await interaction.reply({
			embeds: [RSP(`${DISPLAY_NAME} has been unmuted`, OK_IMG)],
		})
	},
	permissions: [
		{
			id: '532287013219729408',
			type: 'ROLE',
			permission: true,
		},
		{
			id: '417399782928023553',
			type: 'ROLE',
			permission: true,
		},
	],
}
