// ========= Server mute and defen yourself

const { prefix, errorImg } = require('../config/config.json')
const { rsp } = require('../functions')

module.exports = {
	name: 'shh',
	description: 'Sever Mute & Deafen Yourself',
	execute(message, args) {
		const member = message.member

		console.log(member)
		const avatar = message.author.displayAvatarURL({
			format: 'png',
			dynamic: true,
		})

		member.voice.setMute(true)
		member.voice.setDeaf(true)
		return message.channel.send(
			rsp(`It\'s quiet now ${message.member.displayName}`, avatar)
		)
	},
}
