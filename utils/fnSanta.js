const {
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require('discord.js')

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
