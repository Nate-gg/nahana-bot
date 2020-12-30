const Discord = require('discord.js')
const locations = require('../db/mc.json')


module.exports = {
	name: 'mc-list',
    description: 'List Minecraft Locations',
    args: false,  
	execute(message, args) {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#70B237')
        .setTitle('Minecraft Location List')
        .setDescription('A List Of Saved Minecraft Locations')
        .setAuthor('Server: nahana.serv.onl', 'https://ggservers.com/images/diamond.png')
        for(let item of locations) {
            exampleEmbed.addFields(
                { name: 'Coordinates', value: item.coords, inline: true},
                { name: 'World', value: item.world, inline: true},
                { name: 'Location', value: item.desc, inline: true}
            )
        }


    
    message.channel.send(exampleEmbed)
    }
}