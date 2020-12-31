// ========= Trys to pull a random image from a subreddit

const Discord = require('discord.js')
const { prefix, errorImg } = require('../config/config.json')
const Reddit = require("@cxllm/reddit")
const rsp = require('../responses.js')

module.exports = {
    name: 'r/',
    description: 'Pulls a random post from a subreddit',
    args: true,
    usage: `You need to specify a subreddit: \n eg: ${prefix}r pics`,
    execute(message, args) {
        const sub = args[0]
        let send = false
        let int = 0
        const max = 20
        let brb
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']

        const BRBembed = new Discord.MessageEmbed()
        .setColor('#efb055')
        .setTitle('One Sec')
        .setImage('https://cdn.discordapp.com/emojis/700191725846790276.gif?v=1')
              
        message.channel.send(BRBembed).then((sent) => {
            brb = sent
        })

        const getPic = () => {
            if(int === max) {
                brb.delete()
                return message.channel.send(rsp('Sorry ... I couldn\'t find any images to show', errorImg))
            }
            Reddit.random(sub)
            .then(res => {
                const urlExtension = res.image.split('.').pop()
                const isImage = imageExtensions.find((ext) => ext === urlExtension)

                if(!isImage) {
                    int++
                    return getPic()
                }

                if(!message.channel.nsfw && res.nsfw) {
                    int++
                    return getPic()
                }

                brb.delete()
                const embed = new Discord.MessageEmbed()
                    .setColor('#efb055')
                    .setTitle(res.title)
                    .setURL(res.url)
                    .setImage(res.image)
                    .setFooter(`r/${res.subreddit}`)

                message.channel.send(embed)
            })
            .catch(() => {
                brb.delete()
                return message.channel.send(rsp(`r/${sub} doesn't exist`, errorImg))
            })
        } 

        getPic()
    },
}
