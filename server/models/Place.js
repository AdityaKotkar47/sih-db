const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    map_url: { type: String, required: true },
    image_url: { type: String, required: true },
    ratings: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = placeSchema; 