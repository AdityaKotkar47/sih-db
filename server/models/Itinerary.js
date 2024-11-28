const mongoose = require('mongoose');
const placeSchema = require('./Place');

const itinerarySchema = new mongoose.Schema({
    location: { type: String, required: true },
    hotels: [placeSchema],
    tourist_spots: [placeSchema],
    restaurants: [placeSchema],
    market_places: [placeSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', itinerarySchema); 