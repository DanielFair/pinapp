const mongoose = require('mongoose');

let imgSchema = new mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
    user: {type: String, required: true},
    likes: {type: Number, required: true},
    liked: {type: Array}
}, {collection: 'allPins'});

let Pin = mongoose.model('Pin', imgSchema);

module.exports = Pin;

