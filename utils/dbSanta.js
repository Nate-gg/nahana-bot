const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

exports.startDb = async () => {
	const db = await open({
		filename: './db/bunchOhs.db',
		driver: sqlite3.Database,
	})

	return db
}

exports.addSantaUser = async userId => {
	const db = await this.startDb()

	const result = await db.all(`SELECT * from santaUsers where id = ${userId}`)

	if (result.length === 0) {
		await db.run('INSERT INTO santaUsers (id) VALUES (?)', userId)
		return true
	} else {
		return false
	}
}

exports.updateSantaUserInfo = async (obj, userId) => {
	const db = await this.startDb()
	const keys = []
	const params = []

	Object.keys(obj).forEach(e => {
		if (obj[e]) {
			keys.push(`${e} = ?`)
			params.push(obj[e])
		}
	})

	params.push(Date.now())
	params.push(userId)

	await db.run(
		`UPDATE santaUsers SET ${keys.toString()}, lastUpdate = ? where id = ?`,

		params
	)

	return
}

exports.getSantaUserInfo = async userId => {
	const db = await this.startDb()

	const result = await db.get(`SELECT * from santaUsers WHERE id = ${userId}`)

	return result
}

exports.addSantaRestriction = async (userOne, userTwo) => {
	const db = await this.startDb()

	try {
		const result = await db.run(
			'INSERT into santaRestrictions (userOne, userTwo) values (?, ?)',
			[userOne, userTwo]
		)

		return result
	} catch (e) {
		return false
	}
}
