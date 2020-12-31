// ========= Where's Mike?

const { prefix, okImg } = require('../config/config.json')
const path = require('path')
const where = require('../db/mike.json')
const rsp = require('../responses.js')
const fs = require('fs')

module.exports = {
    name: 'isawmikeyb',
    args: true,
    usage: `Where did you see him? \n eg ${prefix}isawmikeyb getting dunked on`,
    channels: ['759209717402435634', '569908876682592266'],
    description: 'Help Us Find Mike',
    execute(message, args) {
        const responses = [...where]
        const newResponse = { response: args.join(' ') }

        responses.push(newResponse)
        fs.writeFile(
            path.resolve(__dirname, '../db/mike.json'),
            JSON.stringify(responses, null, 2),
            (err) => {
                if (err) throw err
            }
        )
        message.channel.send(rsp('Thanks my dude. One more place to look.', okImg))
    },
}
