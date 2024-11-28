const {
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require('discord.js')

const { getPackages, getSantaUserInfo } = require('./dbSanta')
const { ERROR_IMG } = require('../config/config.json')

exports.buildHistoryList = (year, obj, drawings, interaction) => {
	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`Sneaky Santa ${year}`)

	const desc = obj.map(item => {
		let userOne = interaction.guild.members.cache.get(item.UserID)
		let userTwo = interaction.guild.members.cache.get(item.Picked)

		return `${userOne} Picked ${userTwo}`
	})
	embed.setDescription(desc.join(`\r\r`))

	const len = drawings.length
	const current = drawings.findIndex(item => item.Year === year)
	const previous = drawings[(current + len - 1) % len]
	const next = drawings[(current + 1) % len]

	const currentButton = new ButtonBuilder()
		.setCustomId('null')
		.setLabel(`${year}`)
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true)

	const previousButton = new ButtonBuilder()
		.setCustomId(`santaHistory-${previous.Year}`)
		.setLabel('<')
		.setStyle(ButtonStyle.Success)

	const nextButton = new ButtonBuilder()
		.setCustomId(`santaHistory-${next.Year}`)
		.setLabel('>')
		.setStyle(ButtonStyle.Success)

	const row = new ActionRowBuilder().addComponents(
		previousButton,
		currentButton,
		nextButton
	)

	return {
		embed: embed,
		row: row,
	}
}

exports.trackingButton = (courier, tracking) => {
	const courierLinks = [
		{
			courier: 'usps',
			link: 'https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels={tracking}%2C&tABt=false',
		},
		{
			courier: 'fedex',
			link: 'https://www.fedex.com/fedextrack/?trknbr={tracking}',
		},
		{
			courier: 'ups',
			link: 'https://www.ups.com/track?track=yes&trackNums={tracking}',
		},
	]

	const index = courierLinks.findIndex(item => item.courier === courier)
	const link = courierLinks[index].link.replace('{tracking}', tracking)

	return `[${tracking}](${link})`
}

exports.packageList = async (userID, page) => {
	const packages = await getPackages(userID)

	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle('No Packages Yet :(')

	if (packages.length === 0) {
		embed.setDescription(`Your Sneaky Santa Hasn't Sent Anything Out Yet`)
		return {
			embed: embed,
			row: false,
		}
	}

	let currentObj = packages[page]

	const len = packages.length
	const current = page
	const previous = (current + len - 1) % len
	const next = (current + 1) % len

	embed
		.setColor('dc5308')
		.setTitle(`Viewing Package ${page + 1} of ${packages.length}`)
		.setThumbnail(
			'https://cdn.discordapp.com/attachments/759209717402435634/1191744506182242385/2c2ca4e7ae6639847c3a49cf8c162db729-10-dick-in-a-box.rsquare.w330.webp'
		)
		.addFields({ name: 'Arriving', value: currentObj.Date })

	if (currentObj.Courier) {
		embed.addFields({ name: 'Courier', value: currentObj.Courier })
	}

	if (currentObj.Tracking) {
		let trackingNumber =
			currentObj.Tracking && currentObj.Courier
				? this.trackingButton(currentObj.Courier, currentObj.Tracking)
				: currentObj.Tracking
		embed.addFields({ name: 'Tracking', value: trackingNumber })
	}

	if (currentObj.Notes) {
		embed.addFields({ name: 'Notes', value: currentObj.Notes })
	}

	const currentButton = new ButtonBuilder()
		.setCustomId('null')
		.setLabel(`${page + 1} of ${packages.length}`)
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true)

	const previousButton = new ButtonBuilder()
		.setCustomId(`santaPackage-${userID}-${previous}`)
		.setLabel('<')
		.setStyle(ButtonStyle.Secondary)

	const nextButton = new ButtonBuilder()
		.setCustomId(`_santaPackage-${userID}-${next}`)
		.setLabel('>')
		.setStyle(ButtonStyle.Secondary)

	const ReceivedButton = new ButtonBuilder()
		.setCustomId(
			`santaReceived_${currentObj.PackageID}_true_${userID}_${current}`
		)
		.setLabel('I Received This!!')
		.setStyle(ButtonStyle.Success)

	if (currentObj.Received) {
		ReceivedButton.setLabel(`Oops I Didn't Received This`)
			.setStyle(ButtonStyle.Danger)
			.setCustomId(
				`santaReceived_${currentObj.PackageID}_false_${userID}_${current}`
			)
	}

	const row = new ActionRowBuilder()

	if (len > 1) {
		row.addComponents(previousButton)
	}

	row.addComponents(currentButton, ReceivedButton)

	if (len > 1) {
		row.addComponents(nextButton)
	}

	return {
		embed: embed,
		row: row,
	}
}

exports.santaDisallowDM = async userID => {
	const user = await getSantaUserInfo(userID)

	if (!user) {
		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Not Allowed')
			.setDescription('Sorry, you can use this command')
			.setImage(ERROR_IMG)

		return {
			notAllowed: true,
			embed: embed,
		}
	} else {
		return false
	}
}
