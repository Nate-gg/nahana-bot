const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { supabase } = require('../utils/supabaseClient')
const { packageEmbed, quetionEmbed, answerEmbed } = require('./embeds')

exports.addSantaUser = async userId => {
	const { error } = await supabase.from('Users').insert({ UserID: userId })

	return {
		error: error ? true : false,
		message: error ? error.details : 'success',
	}
}

exports.updateSantaUserInfo = async (obj, userId) => {
	const insert = Object.fromEntries(
		Object.entries(obj).filter(([_, v]) => v != null) // eslint-disable-line no-unused-vars
	)

	insert['LastUpdate'] = Date.now()

	await supabase.from('Users').update(insert).eq('UserID', userId)

	return
}

exports.getSantaUserInfo = async userId => {
	const { data } = await supabase
		.from('Users')
		.select()
		.eq('UserID', userId)
		.single()

	return data
}

exports.addSantaRestriction = async (userOne, userTwo) => {
	const { error } = await supabase
		.from('Restrictions')
		.insert({ UserOne: userOne, UserTwo: userTwo })

	return {
		error: error ? true : false,
		message: error ? error.details : 'success',
	}
}

exports.checkActiveDrawing = async () => {
	const { data } = await supabase.from('Drawing').select().eq('Active', true)

	return data.length > 0 ? true : false
}

exports.addSantaDrawing = async year => {
	const { data: newRow } = await supabase
		.from('Drawing')
		.insert({ Year: year, Active: true })
		.select()
		.single()

	const { data } = await supabase
		.from('Users')
		.select('UserID')
		.neq('Inactive', true)

	const insert = data.map(item => {
		return {
			UserID: item.UserID,
			Drawing: newRow.ID,
		}
	})

	await supabase.from('TempPool').insert(insert)

	return data
}

exports.setSantaParticipating = async (participating, userId) => {
	await supabase
		.from('TempPool')
		.update({ Participating: participating })
		.eq('UserID', userId)

	return
}

exports.getSantaParticipating = async () => {
	const { data } = await supabase
		.from('TempPool')
		.select()
		.eq('Participating', true)

	return data.length > 0 ? data : false
}

exports.getAwaitingSantaParticipating = async () => {
	const { data } = await supabase
		.from('TempPool')
		.select()
		.is('Participating', null)

	return data.length > 0 ? data : false
}

exports.clearSantaParticipating = async () => {
	await supabase.from('TempPool').delete()

	return
}

exports.getRestrictions = async () => {
	const { data } = await supabase.from('Restrictions').select()

	return data
}

exports.getPreviousDraws = async () => {
	const { data } = await supabase
		.from('Picks')
		.select(
			`
            *, 
            Drawing!inner(ID)`
		)
		.eq('Drawing.Exclude', true)

	return data
}

exports.getAllDrawings = async () => {
	const { data } = await supabase
		.from('Drawing')
		.select()
		.order('Year', { ascending: false })
		.eq('Active', false)

	return data
}

exports.getDrawingPicks = async drawingId => {
	const { data } = await supabase
		.from('Picks')
		.select()
		.eq('Drawing', drawingId)

	return data
}

exports.getUserPick = async userID => {
	const { data } = await supabase
		.from('Picks')
		.select('*, Drawing!inner(ID)')
		.eq('UserID', userID)
		.is('Drawing.Active', true)
		.single()

	return data
}

exports.getPickedBy = async userID => {
	const { data } = await supabase
		.from('Picks')
		.select('*, Drawing!inner(ID)')
		.eq('Picked', userID)
		.is('Drawing.Active', true)
		.single()

	return data
}

exports.addPackage = async (from, to, date, courier, tracking, notes) => {
	await supabase.from('Packages').insert({
		From: from,
		To: to,
		Date: date,
		Courier: courier,
		Tracking: tracking,
		Notes: notes,
	})

	return
}

exports.getPackages = async userID => {
	const { data } = await supabase
		.from('Packages')
		.select()
		.eq('To', userID)
		.order('PackageID')

	return data
}

exports.getQuestions = async userID => {
	const { data } = await supabase
		.from('Questions')
		.select()
		.eq('To', userID)
		.order('QuestionID')

	return data
}
exports.answerQuestion = async (questionID, answer) => {
	const { data } = await supabase
		.from('Questions')
		.update({ Answer: answer })
		.eq('QuestionID', questionID)

	return data
}

exports.askQuestion = async (fromID, toID, question) => {
	const { data } = await supabase
		.from('Questions')
		.insert({ From: fromID, To: toID, Question: question })

	return data
}

exports.setPackageReceived = async (packageID, received) => {
	const { data } = await supabase
		.from('Packages')
		.update({ Received: received })
		.eq('PackageID', packageID)

	return data
}

exports.santaGetProgress = async () => {
	const { data } = await supabase
		.from('Users')
		.select('*, Packages!Packages_To_fkey (To, Received))')
		.is('Inactive', false)

	return data
}

exports.santaRealtime = async client => {
	supabase
		.channel('realtime-packages')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'Packages',
			},
			async payload => {
				const toUser = await client.users.fetch(payload.new.To)

				const userEmbed = packageEmbed(
					payload.new.Date,
					payload.new.Courier,
					payload.new.Tracking,
					payload.new.Notes
				)

				toUser.send({
					embeds: [userEmbed],
				})
			}
		)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'Packages',
			},
			async payload => {
				const toUser = await client.users.fetch(payload.new.To)

				const userEmbed = packageEmbed(
					payload.new.Date,
					payload.new.Courier,
					payload.new.Tracking,
					payload.new.Notes,
					true
				)

				toUser.send({
					embeds: [userEmbed],
				})
			}
		)
		.subscribe()

	supabase
		.channel('realtime-questions')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'Questions',
			},
			async payload => {
				const toUser = await client.users.fetch(payload.new.To)
				const userEmbed = quetionEmbed(payload.new.Question)

				const AnswerButton = new ButtonBuilder()
					.setCustomId(
						`answerQuestion||||${payload.new.QuestionID}||||${payload.new.Question}`
					)
					.setLabel('Answer This Question')
					.setStyle(ButtonStyle.Success)

				const row = new ActionRowBuilder()
				row.addComponents(AnswerButton)

				toUser.send({
					embeds: [userEmbed],
					components: [row],
				})
			}
		)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'Questions',
			},
			async payload => {
				console.log('answer payload')
				const fromUser = await client.users.fetch(payload.new.From)
				const userEmbed = answerEmbed(
					payload.new.Answer,
					payload.new.Question
				)

				// const AnswerButton = new ButtonBuilder()
				// 	.setCustomId(
				// 		`answerQuestion||||${payload.new.QuestionID}||||${payload.new.Question}`
				// 	)
				// 	.setLabel('Answer This Question')
				// 	.setStyle(ButtonStyle.Success)

				// const row = new ActionRowBuilder()
				// row.addComponents(AnswerButton)

				fromUser.send({
					embeds: [userEmbed],
				})
			}
		)
		.subscribe()
}
