const { client, Discord } = require('./discord')
const cron = require('node-cron')

const Filter = require('bad-words')
const filter = new Filter()

const fs = require('fs')
const { DateTime } = require('luxon')

exports.startUp = () => {
	console.log(`Logged in as ${client.user.tag}`)
	exports.setCron()
}
exports.rsp = (error, img, color = '#efb055') => {
	const msg = new Discord.MessageEmbed().setColor(color).setAuthor(error, img)
	return msg
}

exports.setCron = () => {
	cron.schedule('0 10 * * *', () => {
		const d = new Date()
		const thisMonth = d.getMonth() + 1
		const thisDate = d.getDate()

		exports.getBirthdays(thisMonth, thisDate)
	})
}

exports.getBirthdays = (month, day) => {
	const general = client.channels.cache.get('528964687824551938')
	//for testing in testing-space
	// const general = client.channels.cache.get('759209717402435634')

	const buffer = fs.readFileSync('./db/bday.json')
	const birthdays = JSON.parse(buffer)

	const todayBDays = birthdays.filter(
		el => el.month === month && el.day === day
	)
	for (const el of todayBDays) {
		const user = client.users.cache.get(el.user)
		general.send(
			exports.rsp(
				`Today (${month}-${day}) Is ${user.username} 's Birthday!!`,
				'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'
			)
		)
		general.send(`Happy Birthday <@${user.id}>`)
	}

	let today = DateTime.local()
	const nextWeek = []
	for (let i = 1; i < 8; i++) {
		let next = today.plus({ days: i })
		let obj = {
			month: next.month,
			day: next.day,
			days_away: i,
		}
		nextWeek.push(obj)
	}

	const upcoming = birthdays.filter(el => {
		return nextWeek.some(d => {
			return el.day === d.day && el.month == d.month
		})
	})

	if (upcoming.length !== 0) {
		const embed = new Discord.MessageEmbed()
			.setColor('#efb055')
			.setTitle('Upcoming Birthdays!!')
			.setThumbnail(
				'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'
			)

		for (const el of upcoming) {
			const diff = exports.bdayIsIn(el.month, el.day)
			const user = client.users.cache.get(el.user)
			let inDays = 'tomorrow!'

			if (diff.days > 1) {
				inDays = `in ${diff.days} days!`
			}
			embed.addField(`${user.username}'s birthday`, `is ${inDays}`)
		}
		embed.setTimestamp()
		embed.setFooter('Set Your Calenders!')
		general.send(embed)
	}
}

exports.bdayIsIn = (month, day) => {
	const today = DateTime.local().minus({ day: 1 })
	const year =
		month < today.month
			? today.plus({ year: 1 }).toFormat('yyyy')
			: today.toFormat('yyyy')
	const bday = DateTime.fromObject({
		month: month,
		day: day,
		year: year,
	})
	return bday.diff(today, ['days', 'hours']).toObject()
}

exports.badWordFilter = message => {
	const chatsToPolice = ['528964687824551938', '759209717402435634']
	const searchChannel = chatsToPolice.find(id => id === message.channel.id)

	if (!searchChannel) {
		return
	}

	filter.addWords('titty', 'carl')

	if (filter.isProfane(message)) {
		const cleaned = filter.clean(message.content)
		message.delete()

		let newMessage = `Watch your mouth\n\n`
		newMessage += `\> ${cleaned}`

		message.reply(newMessage)
	}
}
