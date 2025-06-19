const { EmbedBuilder } = require('discord.js')

exports.santaUserEmbed = (userObj, user, command) => {
	const name = user.nickname ? user.nickname : user.username

	const embed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(`${name}'s Info`)
		.addFields({
			name: '🏠 Address',
			value: `${userObj.Name}\r${userObj.Street}\r${userObj.City} ${userObj.State} ${userObj.Zip}`,
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

	if (command === 'santa-view-my-info') {
		embed.addFields({
			name: ' ',
			value: 'You can update your info with </santa-update-my-info:1192252897002528807> or at https://sneaky-santa.vercel.app',
		})
	}

	return embed
}

exports.packageEmbed = (
	date,
	courier = null,
	tracking = null,
	notes = null,
	update = false
) => {
	const userEmbed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle(
			!update
				? 'You Have A Package Coming!!'
				: 'One Of Your Packages Has Been Updated'
		)
		.setThumbnail(
			'https://cdn.discordapp.com/attachments/759209717402435634/1191744506182242385/2c2ca4e7ae6639847c3a49cf8c162db729-10-dick-in-a-box.rsquare.w330.webp'
		)
		.addFields({ name: 'Arriving', value: date })

	if (courier) {
		userEmbed.addFields({ name: 'Courier', value: courier })
	}

	if (tracking) {
		userEmbed.addFields({ name: 'Tracking', value: tracking })
	}

	if (notes) {
		userEmbed.addFields({ name: 'Notes', value: notes })
	}

	userEmbed.addFields({
		name: ' ',
		value: 'You can view all your packages, and mark them as received with </santa-view-packages:1192252897342259272> or at https://sneaky-santa.vercel.app',
	})

	return userEmbed
}

exports.quetionEmbed = question => {
	const userEmbed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle('Your Sneaky Santa Has A Question!')
		.setDescription(`Q: ${question}`)
		.setThumbnail(
			'https://cdn.discordapp.com/attachments/1190153012136644638/1191529479185641612/de558f3110d42ef72a88ad3d7cefd9ad.jpg'
		)
		.addFields({
			name: ' ',
			value: 'You can answer this later with </santa-answer:1192252897002528802> or at https://sneaky-santa.vercel.app',
		})

	return userEmbed
}

exports.answerEmbed = (answer, question) => {
	const userEmbed = new EmbedBuilder()
		.setColor('dc5308')
		.setTitle('An Answer To Your Question!')
		.addFields({ name: 'Question', value: question })
		.addFields({ name: 'Answer', value: answer })
		.addFields({
			name: ' ',
			value: 'You can view all your answers at https://sneaky-santa.vercel.app',
		})

		.setThumbnail(
			'https://cdn.discordapp.com/attachments/1190153012136644638/1191595167996710932/image.png'
		)

	return userEmbed
}
