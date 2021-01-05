// ========= List Birthdays

const { DateTime } = require('luxon')
const { Discord, client } = require('../discord')
const { prefix } = require('../config/config.json')
const birthdays = require('../db/bday.json')
const { bdayIsIn } = require('../functions')

module.exports = {
	name: 'bdaylist',
	description: 'Gets The List Of Birthdays',
	execute(message) {
		;(async () => {
			const today = DateTime.local()

			const membersToFetch = birthdays.map(el => el.user)
			const members = await message.guild.members.fetch({
				user: membersToFetch,
			})

			const bdayList = birthdays
				.map(el => {
					const obj = {}

					let user = message.guild.members.cache.get(el.user)
					obj.user = user.nickname
						? ` ${user.nickname} `
						: ` ${user.user.username} `

					obj.date = DateTime.fromObject({
						month: el.month,
						day: el.day,
					}).toFormat(' LLL dd ')

					obj.inDays = ` ${bdayIsIn(el.month, el.day).days}`
					return obj
				})
				.sort((a, b) => a.inDays - b.inDays)

			const longestName =
				bdayList.reduce(
					(a, b) => (a.length > b.user.length ? a : b.user),
					''
				).length + 3

			bdayList.unshift({
				user: ' User',
				date: ' Date',
				inDays: ' Days Away',
			})

			const longestDate = 6 + 2
			const longestInDays = 9 + 2
			const seperator =
				'+' +
				'-'.repeat(longestName) +
				'+' +
				'-'.repeat(longestDate) +
				'+' +
				'-'.repeat(longestInDays) +
				'+'

			let embed = '```'
			embed += `\n| Banahnah Birthdays ${' '.repeat(longestName)} |`
			embed += `\n${seperator}\n`
			for (const el of bdayList) {
				embed += `|${el.user}`
				embed += ' '.repeat(longestName - el.user.length)
				embed += `|${el.date}`
				embed += ' '.repeat(longestDate - el.date.length)
				embed += `|${el.inDays}`
				embed +=
					' '.repeat(longestInDays - el.inDays.toString().length) +
					'|'
				embed += `\n${seperator}\n`
			}
			embed += '```'

			// const embed = new Discord.MessageEmbed()
			// 	.setTitle('Birthday List!')
			// 	.setColor('#efb055')
			// 	.setThumbnail(
			// 		'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'
			// 	)
			// 	.setFooter(`Add Yours with ${prefix}addmybday`)
			// 	.addFields(
			// 		{
			// 			name: 'User',
			// 			value: bdayList
			// 				.map(el => {
			// 					const user = message.guild.members.cache.get(
			// 						el.user
			// 					)
			// 					return (display = user.nickname
			// 						? user.nickname
			// 						: user.user.username)
			// 				})
			// 				.join('\n-----\n'),
			// 			inline: true,
			// 		},
			// 		{
			// 			name: 'Date',
			// 			value: bdayList
			// 				.map(el => {
			// 					return (date = DateTime.fromObject({
			// 						month: el.month,
			// 						day: el.day,
			// 					}).toFormat('LLL dd'))
			// 				})
			// 				.join('\n------\n'),
			// 			inline: true,
			// 		},
			// 		{
			// 			name: 'Days Away',
			// 			value: bdayList
			// 				.map(el => `Is In ${el.in} Day(s)`)
			// 				.join('\n-----\n'),
			// 			inline: true,
			// 		}
			// 	)
			message.channel.send(embed)
		})()
	},
}
