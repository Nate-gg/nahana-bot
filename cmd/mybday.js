// ========= Add Your Birthday

const { prefix, errorImg, okImg } = require('../config/config.json')
const roleList = require('../db/roles.json')
const path = require('path')
const fs = require('fs')
const rsp = require('../responses.js')
const { DateTime } = require('luxon')
const birthdays = require('../db/bday.json')

module.exports = {
	name: 'addmybday',
    description: 'Add Your Birthday',
    args: true,
    usage: `You need to specify your birtday month and day\n eg: ${prefix}addmybday MM DD`,
	execute(message, args) {
        const member = message.member
        let month = args[0]
        const day = args[1]

        if(birthdays.find(obj => obj.user === member.id)) { 
            return message.channel.send(rsp('We already have your birday', errorImg))
        }

        //create a numeric month from the month they entered; eg will convert Oct to 10
        const monthObject = Date.parse(`${month} 01, 2012`)

        if(!isNaN(monthObject)) {
            month = new Date(monthObject).getMonth() + 1 
        } else {
            return message.channel.send(rsp('Please Enter A Valid Month', errorImg))
        }

        //check if the date is actually a date. We'll use 2012 sinces its a leap year. So was 2020 but fuck 2020
        const isValid = DateTime.fromObject({month : month, day : day, year : '2012'}).isValid

        if(!isValid) {
            return message.channel.send(rsp('Please Enter A Valid Date', errorImg))
        }

        const newBirthday = {'user' : member.id, 'month' : month, 'day' : parseInt(day)}
        birthdays.push(newBirthday)

        fs.writeFile(
            path.resolve(__dirname, '../db/bday.json'),
            JSON.stringify(birthdays, null, 2),
            (err) => {
                if (err) throw err
            }
        )
        message.channel.send(rsp(`Thanks ${member.nickname}. Your Bday has been added!`, okImg))
	},
}