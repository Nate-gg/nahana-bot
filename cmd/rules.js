// ========= List The Rules

const { client, Discord } = require('../discord')

module.exports = {
	name: 'rules',
	description: 'Lists The Ruels',
	args: false,
	execute(message) {
		const rules = `\`\`\`yaml
1. Don't be rude
2. Respect others in the community
3. Harassment, insults, being toxic is not tolerated
4. Keep NSFW material out of PG Chats. 

        
A rule of thumb is if you did not have to agree to the NSFW warning **DO NOT** post NSFW content here. This may result in an instant ban as this is a mixed age server

Feel free to invite your friends!\`\`\``

		console.log(client.user)
		const embed = new Discord.MessageEmbed()
			.setTitle('Rules')
			.setDescription(
				'Server Rules. Please Follow or risk being kicked or even banned'
			)
			.addField('The Rules', rules)
			.setTimestamp()
			.setThumbnail(
				client.user.displayAvatarURL({
					format: 'png',
					dynamic: true,
					size: 1024,
				})
			)

		message.channel.send(embed)
	},
}
