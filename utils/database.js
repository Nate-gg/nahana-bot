const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

exports.startDb = async () => {
	const db = await open({
		filename: './db/bunchOhs.db',
		driver: sqlite3.Database,
	})

	await db.run(
		'CREATE TABLE IF NOT EXISTS reactionRolls (id INTEGER PRIMARY KEY AUTOINCREMENT, embedId VARCHAR(255), roleTitle VARCHAR(255), role VARCHAR(255))'
	)

	return db
}

exports.addMikeLocation = async location => {
	const db = await this.startDb()
	await db.run(
		'CREATE TABLE IF NOT EXISTS mikeLocations (id INTEGER PRIMARY KEY AUTOINCREMENT, location VARCHAR(255)) '
	)

	await db.run('INSERT INTO mikeLocations (location) VALUES (?)', location)

	return 'set'
}

exports.findMike = async () => {
	const db = await this.startDb()
	const result = await db.get(
		'SELECT * from mikeLocations ORDER BY RANDOM() LIMIT 1'
	)

	return result ? result.location : false
}

exports.addRoleSection = async (embedId, title) => {
	const db = await this.startDb()

	await db.run(
		'CREATE TABLE IF NOT EXISTS roleSections (id INTEGER PRIMARY KEY AUTOINCREMENT, embedId VARCHAR(255), sectionTitle VARCHAR(255)) '
	)

	await db.run(
		'INSERT INTO roleSections (embedId, sectionTitle) VALUES (?, ?)',
		embedId,
		title
	)

	return
}

exports.getRoleSection = async messageId => {
	const db = await this.startDb()
	const result = await db.get(
		`SELECT * from roleSections WHERE embedId = ${messageId}`
	)

	return result ? result : false
}

exports.addReactionRole = async (embedId, title, role) => {
	const db = await this.startDb()

	await db.run(
		'CREATE TABLE IF NOT EXISTS reactionRolls (id INTEGER PRIMARY KEY AUTOINCREMENT, embedId VARCHAR(255), roleTitle VARCHAR(255), role VARCHAR(255))'
	)

	await db.run(
		'INSERT INTO reactionRolls (embedId, roleTitle, role) VALUES (?, ?, ?)',
		embedId,
		title,
		role
	)

	return
}

exports.getReactionRoles = async messageId => {
	const db = await this.startDb()
	const result = await db.all(
		`SELECT * from reactionRolls WHERE embedId = ${messageId}`
	)

	return result ? result : false
}

exports.getReactionRole = async role => {
	const db = await this.startDb()

	const result = await db.get(
		`SELECT * from reactionRolls WHERE role = ${role}`
	)

	return result ? result : false
}

exports.removeReactionRole = async role => {
	const db = await this.startDb()

	const result = await db.get(
		`SELECT * from reactionRolls JOIN roleSections ON reactionRolls.embedId = roleSections.embedId WHERE reactionRolls.role = ${role}`
	)

	await db.run(`DELETE from reactionRolls WHERE role = ${role}`)

	return result
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
