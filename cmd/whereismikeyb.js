// ========= Where's Mike?!

const { prefix } = require('../config/config.json')
const path = require('path')
const where = require('../db/mike.json')
const { rsp } = require('../functions')

module.exports = {
    name: 'whereismikeyb',
    roles: ['532287013219729408', '417399782928023553', '532265707405312000'],
    channels: ['759209717402435634', '569908876682592266', '533382961320427531', '528966450409635840'],
    description: 'Help Us Find Mike',
	execute(message, args) {
        const responses = [...where]

        for(let i = responses.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = responses[i]
            responses[i] = responses[j]
            responses[j] = temp
        }
        message.channel.send(rsp(responses[0].response, 'https://cdn.discordapp.com/emojis/766809968858234903.png?v=1', '#fb1919'))
	},
}

