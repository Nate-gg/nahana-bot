// // ========= List The Rules

const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('View Server Rules'),

	async execute(interaction) {
		const RULES = `\`\`\`yaml
1. Don't be rude
2. Respect others in the community
3. Harassment, insults, being toxic is not tolerated
4. Keep it SFW.
    - No NSFW media and / or topics outside of adult channels
    - Keep the language on the clean side, mainly in general chat. Offtopic chats are a little more lenient, but still keep it on the cleaner side.
        
A rule of thumb is if you did not have to agree to the NSFW warning **DO NOT** post NSFW content here. This may result in an instant ban as this is a mixed age server
        


Feel free to invite your friends!\`\`\``

		const RULES_EMBED = new MessageEmbed()
			.setTitle('Rules')
			.setDescription(
				'Server Rules. Please Follow or risk being kicked or even banned'
			)
			.addField('The Rules', RULES)
			.setTimestamp()
			.setThumbnail(
				interaction.client.user.displayAvatarURL({
					format: 'png',
					dynamic: true,
					size: 1024,
				})
			)

		await interaction.reply({ embeds: [RULES_EMBED] })
	},
}
