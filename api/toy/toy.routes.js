const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg } = require('./toy.controller')

const router = express.Router()

router.get('/', log, getToys)
router.get('/:toyId', getToyById)
router.post('/', addToy)
router.put('/:toyId', updateToy)
router.delete('/:toyId', removeToy)

router.post('/:toyId/msg', addToyMsg)

// router.get('/', log, getToys)
// router.get('/:toyId', getToyById)
// router.post('/', requireAdmin, addToy)
// router.put('/:toyId',requireAdmin, updateToy)
// router.delete('/:toyId', requireAdmin, removeToy)
// router.post('/:toyId/msg', requireAuth, addToyMsg)

module.exports = router
