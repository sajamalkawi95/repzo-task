const mongoose = require('mongoose');
const visitSchema = new mongoose.Schema({
    client: { type: String },
    user: { type: String },
    time: { type: Date }
})
const visitModel = mongoose.model('Visit', visitSchema)
module.exports = { visitModel }
