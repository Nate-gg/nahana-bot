const { supabase } = require('../utils/supabaseClient')

exports.addSantaUser = async userId => {
	const { error } = await supabase
		.from('NB-SantaUsers')
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

	await supabase.from('NB-SantaUsers').update(insert).eq('UserID', userId)

	return
}

exports.getSantaUserInfo = async userId => {
	const { data } = await supabase
		.from('NB-SantaUsers')
		.select()
		.eq('UserID', userId)
		.single()

	return data
}

exports.addSantaRestriction = async (userOne, userTwo) => {
	const { error } = await supabase
		.from('NB-SantaRestrictions')
		.insert({ UserOne: userOne, UserTwo: userTwo })

	return {
		error: error ? true : false,
		message: error ? error.details : 'success',
	}
}

exports.checkActiveDrawing = async () => {
	const { data } = await supabase
		.from('NB-SantaDrawing')
		.select()
		.eq('Active', true)

	return data.length > 0 ? true : false
}

exports.addSantaDrawing = async year => {
	const { data: newRow } = await supabase
		.from('NB-SantaDrawing')
		// .insert({ Year: year, Active: true })
		.insert({ Year: year })
		.select()
		.single()

	const { data } = await supabase
		.from('NB-SantaUsers')
		.select('UserID')
		.neq('Inactive', true)

	const insert = data.map(item => {
		return {
			UserID: item.UserID,
			Drawing: newRow.ID,
		}
	})

	await supabase.from('NB-SantaTempPool').insert(insert)

	return data
}

exports.setSantaParticipating = async (participating, userId) => {
	await supabase
		.from('NB-SantaTempPool')
		.update({ Participating: participating })
		.eq('UserID', userId)

	return
}

exports.getSantaParticipating = async () => {
	const { data } = await supabase
		.from('NB-SantaTempPool')
		.select()
		.eq('Participating', true)

	return data.length > 0 ? data : false
}

exports.getAwaitingSantaParticipating = async () => {
	const { data } = await supabase
		.from('NB-SantaTempPool')
		.select()
		.is('Participating', null)

	return data.length > 0 ? data : false
}

exports.clearSantaParticipating = async () => {
	await supabase.from('NB-SantaTempPool').delete()

	return
}

exports.getRestrictions = async () => {
	const { data } = await supabase.from('NB-SantaRestrictions').select()

	return data
}

exports.getPreviousDraws = async () => {
	const { data, error } = await supabase
		.from('NB-SantaPicks')
		.select(
			`
            *, 
            NB-SantaDrawing!inner(ID)`
		)
		.eq('NB-SantaDrawing.Exclude', true)

	return data
}

exports.getAllDrawings = async () => {
	const { data } = await supabase
		.from('NB-SantaDrawing')
		.select()
		.order('Year', { ascending: false })
		.eq('Active', false)

	return data
}

exports.getDrawingPicks = async drawingId => {
	const { data } = await supabase
		.from('NB-SantaPicks')
		.select()
		.eq('Drawing', drawingId)

	return data
}

exports.getUserPick = async userID => {
	const { data } = await supabase
		.from('NB-SantaPicks')
		.select('*, NB-SantaDrawing!inner(ID)')
		.eq('UserID', userID)
		.is('NB-SantaDrawing.Active', true)
		.single()

	return data
}
