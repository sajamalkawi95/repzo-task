'use strict'
const mongoose = require('mongoose')
const clientSchema = new mongoose.Schema({
    name: { type: String }
})
const clientModel = mongoose.model('Client', clientSchema)
module.exports = { clientModel }
