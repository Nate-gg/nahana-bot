// ========= Demotes A User

const { prefix, errorImg } = require('../config/config.json')
const roleList = require('../db/roles.json')
const {rsp} = require('../functions')

module.exports = {
	name: 'demote',
    description: 'Demotes A Member',
    args: true,
    usage: `You need to specify the member to demote \n eg: ${prefix}demote <member>`,
    roles: ['532287013219729408','417399782928023553'],    
	execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(rsp('You need to tag a user to demote them', errorImg))
        }
        const member = message.mentions.members.first()
        const avatar = message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true })
        
        const remove = roleList.roles.find(role => member.roles.cache.has(role))
        member.roles.remove(remove)
        return message.channel.send(rsp(`RIP ... ${member.displayName} was demoted`, avatar))
	},
}