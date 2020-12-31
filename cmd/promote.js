// ========= Promote A User

const { prefix, errorImg } = require('../config/config.json')
const roleList = require('../db/roles.json')
const { rsp } = require('../functions')

module.exports = {
    name: 'promote',
    description: 'Promote A Member',
    args: true,
    usage: `You need to specify the member to promote \n eg: ${prefix}promote <member>`,
    roles: ['532287013219729408', '417399782928023553'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(rsp('You need to tag a user to promote them', errorImg))
        }
        const member = message.mentions.members.first()
        const avatar = message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true })

        const highest = roleList.roles.find((role) =>
            member.roles.cache.has(role)
        )
        let index = roleList.roles.findIndex((ele) => ele === highest)

        if (index === -1) {
            index = roleList.roles.length
        }

        if (index === 0) {
            return message.channel.send(rsp(`${member.displayName} already has the highest role`, errorImg))
        }
        index = index - 1

        member.roles.add(roleList.roles[index])
        return message.channel.send(rsp(`Congrats!! ${member.displayName} was promoted`, avatar))
    },
}
