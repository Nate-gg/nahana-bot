/**
 * Sneaky Santa Drawing
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const {
	getSantaParticipating,
	getRestrictions,
	getPreviousDraws,
	getSantaUserInfo,
	getAwaitingSantaParticipating,
	clearSantaParticipating,
} = require('../utils/dbSanta')
const { OK_IMG, ERROR_IMG } = require('../config/config.json')
const { santaUserEmbed } = require('../utils/embeds')
const { supabase } = require('../utils/supabaseClient')
const { disallowDM } = require('../utils/fnGlobal')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santa-draw-names')
		.setDescription('Draws Names'),

	async execute(interaction) {
		const DM = disallowDM(interaction.guildId)
		if (DM) {
			return interaction.reply({
				embeds: [DM.embed],
			})
		}

		const embed = new EmbedBuilder().setColor('dc5308')
		const participants = await getSantaParticipating()

		/** ===== If the pool is empty theres no drawing going */
		if (!participants) {
			embed
				.setTitle('Error')
				.setDescription('Theres No Sneaky Santa Running To Draw From')
				.setThumbnail(ERROR_IMG)

			return await interaction.reply({
				embeds: [embed],
			})
		}

		/** ===== make sure we're not waiting on any answers */
		const awaiting = await getAwaitingSantaParticipating()
		let awaitingDesc = `We're waiting on:\r`

		if (awaiting) {
			awaiting.map(item => {
				awaitingDesc += `<@${item.UserID}> `
			})

			embed
				.setTitle('Cant Draw Yet. Still Waiting On Some People')
				.setDescription(awaitingDesc)
				.setThumbnail(ERROR_IMG)

			return await interaction.reply({
				embeds: [embed],
			})
		}

		const restrictions = await getRestrictions()
		const previousDraws = await getPreviousDraws()
		const picked = []

		let drawingPool = participants.map(item => {
			/** ===== start with a fresh pool */
			let myPool = [...participants]

			/** ===== remove user */
			myPool = myPool.filter(user => user.UserID !== item.UserID)

			/** ===== remove any pick restrictions */
			myPool = myPool.filter(
				user =>
					!restrictions.find(
						rUser =>
							(rUser.UserOne === item.UserID &&
								rUser.UserTwo === user.UserID) ||
							(rUser.UserTwo === item.UserID &&
								rUser.UserOne === user.UserID)
					)
			)

			/** ===== remove previous picks */
			myPool = myPool.filter(
				user =>
					!previousDraws.find(
						rUser =>
							rUser.UserID === item.UserID &&
							rUser.Picked === user.UserID
					)
			)

			return {
				user: item.UserID,
				pool: myPool,
			}
		})

		/** ===== randomize the pool */
		drawingPool = drawingPool.sort((a, b) => a.pool.length - b.pool.length)

		/** ===== try to pull a pick
		 *  ===== this fails sometimes due to picking limitations ... instead of retrying, we just throw an error to try again
		 *
		 */
		try {
			const picks = drawingPool.map(item => {
				const pool = item.pool.filter(
					user => !picked.find(rUser => rUser === user.UserID)
				)

				drawingPool = shuffle(pool)
				picked.push(drawingPool[0].UserID)

				return {
					user: item.user,
					pick: drawingPool[0].UserID,
				}
			})

			const insert = []

			for (const item of picks) {
				let user = interaction.guild.members.cache.get(item.user)
				let pickedUser = interaction.guild.members.cache.get(item.pick)
				const pickedObj = await getSantaUserInfo(item.pick)

				const embed = new EmbedBuilder()
					.setColor('dc5308')
					.setTitle(`🎁🎄 It's Sneaky Santa Time 🎄🎁\r\r`)
					.setDescription(
						`Below Is Who You Picked!! \r\rYou can ask them questions by using </santa-ask:1192252897002528803>\r\rWhen you send them a package you can let them know with </santa-add-package:1192252897002528799>`
					)

				user.send({
					embeds: [embed],
				})

				user.send({
					embeds: [santaUserEmbed(pickedObj, pickedUser.user)],
				})

				insert.push({
					UserID: item.user,
					Picked: item.pick,
					Drawing: participants[0].Drawing,
				})
			}

			await supabase.from('Picks').insert(insert)
			await clearSantaParticipating()

			embed
				.setTitle('YAY!!')
				.setDescription('Names are drawn and DMs are going out!')
				.setThumbnail(OK_IMG)
			await interaction.reply({
				embeds: [embed],
			})
		} catch (e) {
			embed
				.setTitle('Error')
				.setDescription('Oops ... Try drawing again')
				.setThumbnail(ERROR_IMG)
			return await interaction.reply({
				embeds: [embed],
			})
		}
	},
}

const shuffle = array => {
	let currentIndex = array.length,
		randomIndex

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}

	return array
}
