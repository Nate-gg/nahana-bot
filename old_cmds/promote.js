/**
 * Promote A User
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const ROLE_LIST = require('../db/roles.json')

const { RSP } = require('../functions')
const { ERROR_IMG, OK_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('promote')
		.setDefaultPermission(false)
		.setDescription('Promote A User')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User To Promote')
				.setRequired(true)
		),

	async execute(interaction) {
		/**
		 * figure out the name to display
		 */
		const MEMBER = interaction.options.getMember('user')
		const DISPLAY_NAME = MEMBER.nickname
			? MEMBER.nickname
			: MEMBER.user.username

		/**
		 * find the users highest role
		 */

		const HIGHEST = ROLE_LIST.roles.find(role =>
			MEMBER.roles.cache.has(role)
		)

		let index = ROLE_LIST.roles.findIndex(ele => ele === HIGHEST)

		if (index === -1) {
			index = ROLE_LIST.roles.length
		}

		/**
		 * has the highest role
		 */

		if (index === 0) {
			await interaction.reply({
				embeds: [
					RSP(
						`${DISPLAY_NAME} already has the highest role`,
						ERROR_IMG
					),
				],
			})
			return false
		}

		/**
		 * promote the user
		 */

		index = index - 1

		MEMBER.roles.add(ROLE_LIST.roles[index])
		const ROLE = await interaction.guild.roles.fetch(ROLE_LIST.roles[index])

		await interaction.reply({
			embeds: [
				RSP(
					`${DISPLAY_NAME} Has Been Promoted To ${ROLE.name} `,
					OK_IMG
				),
			],
		})
	},

	permissions: [
		{
			id: '417399782928023553',
			type: 'ROLE',
			permission: true,
		},
	],
}
