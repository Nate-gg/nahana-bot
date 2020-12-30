const { prefix, errorImg } = require('../config/config.json')
const rsp = require('../responses.js')

module.exports = {
    name: 'mute',
    description: 'Mute A Member',
    args: true,
    usage: `You need to specify the member to mute \n eg: ${prefix}mute <member>`,
    roles: ['532287013219729408', '417399782928023553'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(rsp('You need to tag a user to mute them.', errorImg))
        }
        const member = message.guild.member(message.mentions.users.first())
        const avatar = message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true })
        const sayings = [
            `Shut Up ${member.displayName}`,
            `${member.displayName} go to timeout`,
            `${member.displayName} is talking too much`,
            `${member.displayName} needs a fresh cup of STFU tea`
        ]
        for(let i = sayings.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = sayings[i]
            sayings[i] = sayings[j]
            sayings[j] = temp
        }        

        member.roles.add('533028666746208267')
        member.voice.setMute(true)
        return message.channel.send(rsp(sayings[0], avatar))
    },
}
