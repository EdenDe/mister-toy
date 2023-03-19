const logger = require('../../services/logger.service')
const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')
const utilService = require('../../services/util.service')

module.exports = {
	query,
	add,
	update,
	remove,
	getById,
	addToyMsg,
}

async function query(filterBy) {
	try {
		const collection = await dbService.getCollection('toy')
		let toys = await collection
			.find(_buildCriteria(filterBy))
			.sort({ [filterBy.sortBy]: -1 })
			.toArray()
		toys = toys.map(toy => {
			toy.createdAt = new ObjectId(toy._id).getTimestamp()
			return toy
		})
		return toys
	} catch (err) {
		logger.error('cannot find toys', toys)
		throw err
	}
}

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		let user = await collection.findOne({ _id: new ObjectId(toyId) })
		user.createdAt = new ObjectId(toyId).getTimestamp()
		return user
	} catch (err) {
		logger.error(`while finding toy ${toyId}`, err)
		throw err
	}
}

async function add(toy) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.insertOne(toy)
		return toy
	} catch (err) {
		logger.error('cannot insert toy', err)
		throw err
	}
}

async function update(toy) {
	try {
		const collection = await dbService.getCollection('toy')
		let toyToSave = { ...toy }
		delete toyToSave.createdAt
		delete toyToSave._id
		await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
		return toy
	} catch (err) {
		logger.error(`cannot update toy ${toy.id}`, err)
		throw err
	}
}

async function remove(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.deleteOne({ _id: new ObjectId(toyId) })
	} catch (err) {
		logger.error(`cannot remove toy ${toyId}`, err)
		throw err
	}
}

async function addToyMsg(toyId, msg) {
	try {
		msg.id = utilService.makeId()
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	let criteria = {}
	if (!filterBy) return criteria

	if (filterBy.txt) {
		criteria.name = { $regex: filterBy.txt, $options: 'i' }
	}
	if (filterBy.inStock && filterBy.inStock === 'true') {
		criteria.inStock = true
	}
	if (filterBy.labels) {
		criteria.labels = { $in: filterBy.labels }
	}
	return criteria
}
