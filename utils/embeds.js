const { EmbedBuilder } = require('discord.js')

exports.santaUserEmbed = (userObj, user, command) => {
	const name = user.nickname ? user.nickname : user.username

	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`${name}'s Info`)
		.addFields({
			name: '🏠 Address',
			value: `${userObj.Name}\r${userObj.Address}\r${userObj.City} ${userObj.State} ${userObj.Zip}`,
		})

	console.log(command)
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

	if (command === 'santa-view-my-info') {
		embed.addFields({
			name: ' ',
			value: 'You can update your info with </santa-update-my-info:1192252897002528807>',
		})
	}

	return embed
}
