/**
 * Pulls A Random Comment
 */

const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('fs').promises
const { LOADING, PARTY, CHECK } = require('../config/config.json')
const { parse } = require('node-html-parser')
const wait = require('util').promisify(setTimeout)

const { RSP } = require('../functions')

const PARSE = ele => {
	let username = ele.querySelector(
		'.tiktok-ku14zo-SpanUserNameText'
	).innerHTML

	let user = ele
		.querySelector('.tiktok-1rua9e7-StyledUserLinkName')
		.getAttribute('href')
	user = user.replace('/', '')
	user = user.replace('?lang=en', '')

	let comment = ele.querySelector(
		'.tiktok-q9aj5z-PCommentText > span'
	).innerHTML

	return {
		username: username,
		user: user,
		comment: comment,
	}
}

const SHUFFLE = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i)
		const TMP = array[i]
		array[i] = array[j]
		array[j] = TMP
	}

	return array
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Pull A Random Comment From TikTok')
		.addStringOption(option =>
			option
				.setName('keyword')
				.setDescription('keyword to search - seperate kewords by comma')
		),

	async execute(interaction) {
		/*
		 * get the comment html
		 */
		//https://www.tiktok.com/@durdydwayne/video/7041777281693420805?lang=en&is_copy_url=1&is_from_webapp=v1

		const DATA = await fs.readFile('./db/comments.html', 'binary')
		const KEYWORD = interaction.options.getString('keyword')
		const WAIT = 1500
		const FILTER_ARRAY = []
		let word_search

		const ROOT = parse(DATA)
		const MAINS = ROOT.querySelectorAll('.evpz7zo0')
		console.log(MAINS.length)
		let FULL_ARRAY = []

		Array.from(MAINS).forEach(ele => {
			FULL_ARRAY.push(PARSE(ele))
		})

		/*
		 * Start the "logging proces"
		 */

		// send count of all comments
		let current_count = FULL_ARRAY.length
		let text = `Starting The Drawing!`

		await interaction.reply({
			embeds: [RSP(text, CHECK, '#18afee')],
		})
		await wait(WAIT)

		// remove dwaynes comments
		text = `Removing  Author's Comments...`
		await interaction.channel.send({
			embeds: [RSP(text, CHECK, '#18afee')],
		})

		FULL_ARRAY = FULL_ARRAY.filter(e => e.user != '@durdydwayne')

		await wait(WAIT)

		text = `Removed ${
			current_count - FULL_ARRAY.length
		} comments from @durdydwayne `
		await interaction.channel.send({
			embeds: [RSP(text, CHECK, '#18afee')],
		})

		// do we need to look for a keyword?
		current_count = FULL_ARRAY.length

		if (KEYWORD) {
			word_search = KEYWORD.replace(' ', '').split(',')

			text = `Searching For Comments With Keyword: ${word_search.join(
				' or '
			)}`

			await wait(WAIT)
			await interaction.channel.send({
				embeds: [RSP(text, CHECK, '#18afee')],
			})

			FULL_ARRAY = FULL_ARRAY.filter(ele => {
				return word_search.some(v =>
					ele.comment.toLowerCase().includes(v.toLowerCase())
				)
			})

			text = `Found ${
				FULL_ARRAY.length
			} Comments With Keywords ${word_search.join(' or ')}`

			await wait(WAIT)
			await interaction.channel.send({
				embeds: [RSP(text, CHECK, '#18afee')],
			})
		} else {
			text = `No Keyword To Filter...`

			await wait(WAIT)
			await interaction.channel.send({
				embeds: [RSP(text, CHECK, '#18afee')],
			})
		}

		text = `DRAWING!!!`

		await wait(WAIT)
		await interaction.channel.send({
			embeds: [RSP(text, LOADING, '#18afee')],
		})

		await wait(WAIT * 2)

		const RESULTS = SHUFFLE(FULL_ARRAY)

		await wait(WAIT)
		text =
			'CONGRATULATIONS!!\n\nThe Giveaway Winner Is: \n\n' +
			RESULTS[0].user.replace('/', '') +
			''

		await interaction.channel.send({
			embeds: [RSP(text, PARTY, '#18afee')],
		})

		// await wait(WAIT)
		// text =
		// 	'CONGRATULATIONS!!\n\nThe Giveaway Winner Is: \n\n' +
		// 	FULL_ARRAY[0].user.replace('/', '') +
		// 	''

		// await interaction.editReply({
		// 	embeds: [RSP(text, PARTY, '#18afee')],
		// })
	},
	permissions: [
		{
			id: '532287013219729408',
			type: 'ROLE',
			permission: true,
		},
	],
}
