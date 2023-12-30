const { supabase } = require('../utils/supabaseClient')

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

exports.checkActiveDrawing = async () => {
	const { data } = await supabase
		.from('NB.SantaDrawing')
		.select()
		.eq('Active', true)

	return data.length > 0 ? true : false
}

exports.addSantaDrawing = async year => {
	const { data: newRow } = await supabase
		.from('NB.SantaDrawing')
		// .insert({ Year: year, Active: true })
		.insert({ Year: year })
		.select()
		.single()

	const { data } = await supabase
		.from('NB.SantaUsers')
		.select('UserID')
		.neq('Inactive', true)

	const insert = data.map(item => {
		return {
			UserID: item.UserID,
			Drawing: newRow.ID,
		}
	})

	await supabase.from('NB.SantaTempPool').insert(insert)

	return data
}

exports.setSantaParticipating = async (participating, userId) => {
	const { error } = await supabase
		.from('NB.SantaTempPool')
		.update({ Participating: participating })
		.eq('UserID', userId)
}
