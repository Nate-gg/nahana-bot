const Discord = require('discord.js')

module.exports = (error, img, color = '#efb055') => { 
    const msg = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(error, img)
    return msg
}