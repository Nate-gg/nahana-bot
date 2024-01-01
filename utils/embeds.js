const { EmbedBuilder } = require('discord.js')

exports.santaUserEmbed = (userObj, user) => {
	const name = user.nickname ? user.nickname : user.user.username

	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`${name}'s Info`)
		.addFields({
			name: '🏠 Address',
			value: `${userObj.Name}\r${userObj.Address}\r${userObj.City} ${userObj.State} ${userObj.Zip}`,
		})

	if (userObj.Instructions) {
		embed.addFields({
			name: '❗Special Shipping Instructions',
			value: `${userObj.Instructions}`,
		})
	}

	embed
		.addFields({
			name: '💕 Interests',
			value: `${userObj.Interests}`,
		})
		.addFields({
			name: '👕 Size',
			value: `${userObj.Size}`,
		})
		.setTimestamp(userObj.LastUpdate)
		.setThumbnail(user.displayAvatarURL())

	return embed
}
