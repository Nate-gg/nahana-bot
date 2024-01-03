const { EmbedBuilder } = require('discord.js')
const { ERROR_IMG } = require('../config/config.json')

exports.disallowDM = guild => {
	if (!guild) {
		const embed = new EmbedBuilder()
			.setColor('dc5308')
			.setTitle('Not Allowed')
			.setDescription('This Is Now Allowed Via DM')
			.setImage(ERROR_IMG)

		return {
			isDM: true,
			embed: embed,
		}
	} else {
		return false
	}
}
