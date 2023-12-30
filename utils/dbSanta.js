const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const { supabase } = require('../utils/supabaseClient')

exports.startDb = async () => {
	const db = await open({
		filename: './db/bunchOhs.db',
		driver: sqlite3.Database,
	})

	return db
}

exports.addSantaUser = async userId => {
	const { error } = await supabase
		.from('NB.SantaUsers')
		.insert({ UserID: userId })

	return {
		error: error ? true : false,
		message: error ? error.details : 'success',
	}
}

exports.updateSantaUserInfo = async (obj, userId) => {
	const insert = Object.fromEntries(
		Object.entries(obj).filter(([_, v]) => v != null)
	)
	insert['LastUpdate'] = Date.now()

	await supabase.from('NB.SantaUsers').update(insert).eq('UserID', userId)

	return
}

exports.getSantaUserInfo = async userId => {
	const { data } = await supabase
		.from('NB.SantaUsers')
		.select()
		.eq('UserID', userId)
		.single()

	return data
}

exports.addSantaRestriction = async (userOne, userTwo) => {
	const { error } = await supabase
		.from('NB.SantaRestrictions')
		.insert({ UserOne: userOne, UserTwo: userTwo })

	return {
		error: error ? true : false,
		message: error ? error.details : 'success',
	}
}
