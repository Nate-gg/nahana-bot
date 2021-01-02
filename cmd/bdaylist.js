// ========= List Birthdays

const { DateTime } = require('luxon')
const { Discord } = require('../discord')
const { prefix } = require('../config/config.json')
const birthdays = require('../db/bday.json')
const { bdayIsIn } = require('../functions')

module.exports = {
	name: 'bdaylist',
	description: 'Gets The List Of Birthdays',
	execute(message) {
		const today = DateTime.local()

		const bdayList = birthdays
			.map(el => {
				return { ...el, in: bdayIsIn(el.month, el.day).days }
			})
			.sort((a, b) => a.in - b.in)

		const embed = new Discord.MessageEmbed()
			.setTitle('Birthday List!')
			.setColor('#efb055')
			.setThumbnail(
				'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'
			)
			.setFooter(`Add Yours with ${prefix}addmybday`)

		for (const el of bdayList) {
			const user = message.guild.members.cache.get(el.user)
			const display = user.nickname ? user.nickname : user.user.username
			const date = DateTime.fromObject({
				month: el.month,
				day: el.day,
			}).toFormat('LLL dd')

			embed.addFields(
				{
					name: display,
					value: '\u200B',
					inline: true,
				},
				{
					name: date,
					value: '\u200B',
					inline: true,
				},
				{
					name: `In ${el.in} Day(s)`,
					value: '\u200B',
					inline: true,
				}
			)
		}
		message.channel.send(embed)
	},
}
