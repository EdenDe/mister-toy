const fs = require('fs')
const Toys = require('../data/toy.json')

module.exports = {
	query,
	save,
	remove,
	getById,
}

function query(critiria) {
	const filteredToys = _filterBy(critiria)
	return Promise.resolve(filteredToys)
}

function save(toy) {
	if (toy._id) {
		const idx = Toys.findIndex(currToy => currToy._id === toy._id)
		if (idx === -1) return Promise.reject('No such Toy')
		Toys[idx] = toy
	} else {
		toy._id = _makeId()
		toy.createdAt = Date.now()

		Toys.push(toy)
	}

	return _saveToysToFile().then(() => toy)
}

function getById(ToyId) {
	const Toy = Toys.find(Toy => Toy._id === ToyId)
	return Promise.resolve(Toy)
}

function remove(ToyId) {
	const idx = Toys.findIndex(Toy => Toy._id === ToyId)
	if (idx === -1) return Promise.reject('No such Toy')

	Toys.splice(idx, 1)
	return _saveToysToFile()
}

function _filterBy(critiria) {
	let filteredToys = Toys

	if (!critiria) return filteredToys

	let filterBy = {
		txt: critiria.txt || '',
		isOnlyInStock: critiria.isOnlyInStock === 'true' ? true : false,
		labels: critiria.labels || [],
		sortBy: critiria.sortBy || 'created',
	}

	let regex = new RegExp(filterBy.txt, 'i')
	filteredToys = filteredToys.filter(
		toy =>
			regex.test(toy.name) &&
			(!filterBy.isOnlyInStock || toy.inStock === filterBy.isOnlyInStock) &&
			(!filterBy.labels.length || filterBy.labels.some(label => toy.labels.includes(label)))
	)

	if (filterBy.sortBy === 'name') {
		return filteredToys.sort((a, b) => a.name.localeCompare(b.name))
	} else {
		return filteredToys.sort((a, b) => a[filterBy.sortBy] - b[filterBy.sortBy])
	}
}

function _makeId(length = 5) {
	let txt = ''
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function _saveToysToFile() {
	return new Promise((resolve, reject) => {
		const content = JSON.stringify(Toys, null, 2)
		fs.writeFile('./data/Toy.json', content, err => {
			if (err) {
				console.error(err)
				return reject(err)
			}
			resolve()
		})
	})
}
