const mongoose = require('mongoose');

let boardSchema = new mongoose.Schema({
    user: {type: String, required: true},
    pins: {type: Array}
}, {collection: 'boards'});

let Board = mongoose.model('Board', boardSchema);

module.exports = Board;