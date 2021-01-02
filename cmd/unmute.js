// ========= Unmute a user

const { prefix, errorImg } = require('../config/config.json')
const { rsp } = require('../functions')

module.exports = {
	name: 'unmute',
	description: 'Unmute A Member',
	args: true,
	usage: `You need to specify the member to unmute \n eg: ${prefix}mute <member>`,
	roles: ['532287013219729408', '417399782928023553'],
	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send(
				rsp('You need to tag a user to umute them.', errorImg)
			)
		}
		const member = message.guild.member(message.mentions.users.first())
		const avatar = message.mentions.users
			.first()
			.displayAvatarURL({ format: 'png', dynamic: true })

		member.roles.remove('533028666746208267')
		member.voice.setMute(false)
		return message.channel.send(
			rsp(`OK ... You can talk now ${member.displayName}`, avatar)
		)
	},
}
