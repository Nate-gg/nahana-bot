'use strict'

// Discord Libs
const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()

//Packages
const fs = require('fs')
const cron = require('node-cron')
const { DateTime } = require('luxon')

//Local Files
const { prefix, token, errorImg } = require('./config/config.json')
const rsp = require('./responses.js')

//Import all the commands and set them
const cmdFiles = fs.readdirSync('./cmd').filter((file) => file.endsWith('.js'))

for (const file of cmdFiles) {
    const cmd = require(`./cmd/${file}`)

    client.commands.set(cmd.name, cmd)
}

//cron job for birthdays
// ======= MOVE THIS TO FUNCTION EXPORT
const setCron = () => {

    // getBirthdays(12, 29)
    cron.schedule('0 0 * * *', () => {
    //  cron.schedule('*/2 * * * *', () => {
        const d = new Date()
        const thisMonth = d.getMonth() + 1
        const thisDate = d.getDate()
        
        getBirthdays(thisMonth, thisDate)
        console.log(d)
      })
    console.log(`Logged in as ${client.user.tag}!`)    
}

//birthday function
// ======= MOVE THIS TO FUNCTION EXPORT
const getBirthdays = (month, day) => {
    const general = client.channels.cache.get('528964687824551938')

    const buffer = fs.readFileSync('./db/bday.json')
    const birthdays = JSON.parse(buffer)

    const todayBDays = birthdays.filter(el => el.month === month && el.day === day)
    for(const el of todayBDays) {
        const user = client.users.cache.get(el.user)
        general.send(rsp(`Today (${month}-${day}) Is ${user.username} 's Birthday!!`, 'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'))
        general.send(`Happy Birthday <@${user.id}>`)
    }
    
    let today = DateTime.local()
    const nextWeek = []
    for(let i = 1; i < 8; i++) {
        let next = today.plus({ days : i})
        let obj = {
            month : next.month,
            day: next.day,
            days_away: i,
        }
        nextWeek.push(obj)
    }

    const upcoming = birthdays.filter(el => {
        return nextWeek.some(d => {
            return el.day === d.day && el.month == d.month
        })
    })
    
    for(const el of upcoming) {
        const year = (el.month < today.month) ? today.plus({year: 1}).toFormat('yyyy') : today.toFormat('yyyy')
        const bday = DateTime.fromObject({month: el.month, day: el.day, year: year})
        const diff = bday.diff(today, ['days', 'hours']).toObject()
        const user = client.users.cache.get(el.user)
        let inDays = 'tomorrow!'
        if(diff.days > 0) { 
            inDays = `in ${diff.days} days!`
        }
        general.send(rsp(`${user.username}'s birthday is ${inDays}`, 'https://cdn.discordapp.com/emojis/582263922212732940.gif?v=1'))
        console.log(diff)
    }
}

client.on('ready', setCron)

client.on('message', (message) => {

    //set up the bot to receive commands
    if (!message.content.startsWith(prefix) || message.author.bot) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const cmdName = args.shift().toLowerCase()

    if (!client.commands.has(cmdName)) return
    const cmd = client.commands.get(cmdName)

    //check if the command requires roles and check against the users roles
    if (cmd.roles) {
        let hasRole = false

        if (!Array.isArray(cmd.roles)) {
            return message.channel.send(rsp('Something Broke ... Tell Nahana', errorImg))
        }
        cmd.roles.map((role) => {
            if (message.member.roles.cache.has(role)) {
                hasRole = true
            }
        })

        if (!hasRole) {
            return message.channel.send(rsp('You don`t have this power.', 'https://cdn.discordapp.com/emojis/595733409427488768.png?v=1'))
        }
    }

    //check if the command has channel restrictions
    if (cmd.channels) {
        let inChannel = false

        if (!Array.isArray(cmd.channels)) {
            return message.channel.send(rsp('Something Broke ... Tell Nahana', errorImg))
        }
        cmd.channels.map((channel) => {
            if (message.channel.id === channel) {
                inChannel = true
            }
        })

        if (!inChannel) {
            return
        }
    }

    //check if the command needs arguments
    if (cmd.args && !args.length) {
        let reply = 'I need More Info :/'
        if (cmd.usage) {
            reply = rsp(cmd.usage, errorImg)
        }
        return message.channel.send(reply)
    }

    try {
        cmd.execute(message, args)
    } catch (error) {
        console.error(error)
        return message.channel.send(rsp('Something Broke ... Tell Nahana', errorImg))
    }
})

client.login(token)
