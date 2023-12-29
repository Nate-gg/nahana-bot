const { EmbedBuilder } = require('discord.js')

exports.santaUserEmbed = (userObj, user) => {
	const name = user.user.nickname ? user.user.nickname : user.user.username

	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`${name}'s Info`)
		.addFields({
			name: 'Address',
			value: `${userObj.name}\r${userObj.address}\r${userObj.city} ${userObj.state} ${userObj.zip}`,
		})

	if (userObj.instructions) {
		embed.addFields({
			name: 'Special Shipping Instructions',
			value: `${userObj.instructions}`,
		})
	}

	embed
		.addFields({
			name: 'Interests',
			value: `${userObj.interests}`,
		})
		.setTimestamp(userObj.lastUpdate)

	return embed
}
