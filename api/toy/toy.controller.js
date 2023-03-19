const toyService = require('./toy.service.js')
const logger = require('../../services/logger.service')

// LIST
async function getToys(req, res) {
	try {
		const filterBy = req.query
		logger.debug('Getting Toys', filterBy)
		const toys = await toyService.query(filterBy)
		res.json(toys)
	} catch (err) {
		logger.error('Failed to get toys', err)
		res.status(500).send('Cannot get toys')
	}
}

// READ
async function getToyById(req, res) {
	try {
		const { toyId } = req.params

		const toy = await toyService.getById(toyId)
		res.json(toy)
	} catch (err) {
		logger.error('Failed to get a toy', err)
		res.status(500).send('Cannot get toy')
	}
}

// CREATE
async function addToy(req, res) {
	try {
		const toy = req.body

		const savedtoy = await toyService.add(toy)
		res.json(savedtoy)
	} catch (err) {
		logger.error('Failed to get toy', err)
		res.status(500).send('Cannot save toy')
	}
}

// UPDATE
async function updateToy(req, res) {
	try {
		const toy = req.body

		const savedtoy = await toyService.update(toy)
		res.json(savedtoy)
	} catch (err) {
		logger.error('Failed to save toy', err)
		res.status(500).send('Cannot save toy')
	}
}

async function removeToy(req, res) {
	try {
		const { toyId } = req.params

		await toyService.remove(toyId)
		res.send()
	} catch (err) {
		logger.error('Failed to remove toy', err)
		res.status(500).send(err)
	}
}

async function addToyMsg(req, res) {
	const { loggedinUser } = req
	logger.debug('loggedinUser', req.body.loggedinUser)
	try {
		const toyId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser || '64146adef3a0a8d2555c3598',
		}
		const savedMsg = await toyService.addToyMsg(toyId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update toy', err)
		res.status(500).send({ err: 'Failed to update toy' })
	}
}

module.exports = {
	getToys,
	getToyById,
	addToy,
	updateToy,
	removeToy,
	addToyMsg,
}
