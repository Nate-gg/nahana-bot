// ========= Add Locations To The Minecraft List

const { errorImg, okImg } = require('../config/config.json')
const path = require('path')
const fs = require('fs')
const { rsp } = require('../functions')
const locations = require('../db/mc.json')

module.exports = {
	name: 'mc-add',
    description: 'Add Minecraft Coords',
    args: false,  
	execute(message, args) {

        const filter = m => m.author === message.author
        const obj = {}

        message.reply('What Are The Coords').then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time']})
            .then(coordCollected => {
            
               obj['coords'] = coordCollected.first().content
                message.reply('OK. Now What World?').then(() => {
                    message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time']})
                    .then(worldCollected => {
                        obj['world'] = worldCollected.first().content
                        message.reply('OK. Now The Description?').then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time']})
                            .then(descCollected => {
                                obj['desc'] = descCollected.first().content
                                locations.push(obj)
                                fs.writeFile(
                                    path.resolve(__dirname, '../db/mc.json'),
                                    JSON.stringify(locations, null, 2),
                                    (err) => {
                                        if (err) throw err
                                    }
                                )                                
                                message.reply('Thanks! The Location Has Been Added!')
                            })
                            .catch(collected => {
                                message.channel.send(rsp('Sorry. You Took To Long', errorImg)) 
                            })
                        })
                    })
                    .catch(collected => {
                        message.channel.send(rsp('Sorry. You Took To Long', errorImg))
                    })
                })
            }).catch(collected => {
                message.channel.send(rsp('Sorry. You Took To Long', errorImg))
            })
        })
	},
}