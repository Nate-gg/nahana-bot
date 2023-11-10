/**
 * Demote A User
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const ROLE_LIST = require('../db/roles.json')

const { RSP } = require('../functions')
const { ERROR_IMG, OK_IMG } = require('../config/config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('demote')
		.setDefaultPermission(false)
		.setDescription('Demote A User')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User To Promote')
				.setRequired(true)
		),

	async execute(interaction) {
		/**
		 * figure out the name to dispaly
		 */
		const MEMBER = interaction.options.getMember('user')
		const DISPLAY_NAME = MEMBER.nickname
			? MEMBER.nickname
			: MEMBER.user.username

		/**
		 * find the role to remove
		 */
		const INDEX = ROLE_LIST.roles.findIndex(role =>
			MEMBER.roles.cache.has(role)
		)
		if (INDEX === -1) {
			await interaction.reply({
				embeds: [
					RSP(
						`${DISPLAY_NAME} is already the lowest role`,
						ERROR_IMG
					),
				],
			})
			return false
		}

		/**
		 * remove their highest role, and add the next level down if they dont have it
		 */
		const REMOVE = ROLE_LIST.roles[INDEX]
		const ADD = INDEX + 1 >= ROLE_LIST.roles.length ? false : INDEX + 1

		MEMBER.roles.remove(REMOVE)
		if (ADD) {
			MEMBER.roles.add(ROLE_LIST.roles[ADD])
		}

		await interaction.reply({
			embeds: [RSP(`${DISPLAY_NAME} has been demoted`, OK_IMG)],
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
