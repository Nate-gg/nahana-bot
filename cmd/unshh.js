// ========= Server unmute and undefen yourself

const { rsp } = require('../functions')

module.exports = {
	name: 'unshh',
	description: 'sever Unmute & Undeafen Yourself',
	execute(message) {
		const member = message.member

		console.log(member)
		const avatar = message.author.displayAvatarURL({
			format: 'png',
			dynamic: true,
		})

		member.voice.setMute(false)
		member.voice.setDeaf(false)
		return message.channel.send(
			rsp(`Welcom back ${message.member.displayName}`, avatar)
		)
	},
}
