// ========= Bad Word Filter?

const { prefix, okImg } = require('../config/config.json')
const path = require('path')
//const where = require('../db/mike.json')
const { rsp } = require('../functions')
const fs = require('fs')

const BAD_WORDS_ADD = require('../db/badwordAdd.json')
const BAD_WORDS_REMOVE = require('../db/badwordRemove.json')

let addWords = [...BAD_WORDS_ADD]
let removeWords = [...BAD_WORDS_REMOVE]

module.exports = {
	name: 'badword',
	args: true,
	usage: `Please Include add or remove and the word \n eg ${prefix}badword add | remove word`,
	channels: ['759209717402435634'],
	description: 'Bad Word Management',
	execute(message, args) {
		let useCase = args[0]
		args.splice(0, 1)

		let word = args.join(' ')
		let res

		switch (useCase) {
			case 'add':
				addWords.push(word)
				removeWords = removeWords.filter(w => w != word)
				res = `Thanks! ${word} will now be censored`

				break
			case 'remove':
				removeWords.push(word)
				addWords = addWords.filter(w => w != word)
				res = `Thanks! ${word} will now be allowed`
				break
			default:
				break
		}

		fs.writeFile(
			path.resolve(__dirname, '../db/badwordAdd.json'),
			JSON.stringify(addWords, null, 2),
			err => {
				if (err) throw err
			}
		)
		fs.writeFile(
			path.resolve(__dirname, '../db/badwordRemove.json'),
			JSON.stringify(removeWords, null, 2),
			err => {
				if (err) throw err
			}
		)

		message.channel.send(rsp(res, okImg))
	},
}
