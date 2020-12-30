const { prefix } = require('../config/config.json')

module.exports = {
    name: 'clear',
    description: 'Clear Messages',
    args: true,
    usage: `You need to specify the number of messages \n eg: ${prefix}clear 10`,
    roles: ['532287013219729408', '417399782928023553'],
    execute(message, args) {
        const toDelete = parseInt(args[0]) + 1

        if (isNaN(toDelete)) {
            return message.reply('Thats not a number')
        } else if (toDelete <= 1 || toDelete > 51) {
            return message.reply('You can only clear between 1 and 50 messages')
        }

        message.channel.bulkDelete(toDelete, true)
        message.channel.send(`Say bye to all those messages`).then((sent) => {
            return sent.delete({ timeout: 5000 })
        })
    },
}
