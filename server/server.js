const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Itinerary = require('./models/Itinerary');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// URL validation helper
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Data validation and transformation functions
const validateAndTransformData = (collection, data) => {
    if (collection === 'itenaries') {
        if (data.location && typeof data.location !== 'string') {
            throw new Error('Location must be a string');
        }

        const placesCategories = ['hotels', 'tourist_spots', 'restaurants', 'market_places'];
        placesCategories.forEach(category => {
            if (data[category]) {
                data[category].forEach(place => {
                    if (!isValidUrl(place.map_url)) {
                        throw new Error(`Invalid map URL in ${category}`);
                    }
                    if (!isValidUrl(place.image_url)) {
                        throw new Error(`Invalid image URL in ${category}`);
                    }
                    if (isNaN(place.ratings) || place.ratings < 0 || place.ratings > 5) {
                        throw new Error(`Ratings in ${category} must be a number between 0 and 5`);
                    }
                });
            }
        });
    }

    return data;
};

// Generic handler for adding documents to any collection
app.post('/api/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        let data = { ...req.body };

        // Special handling for users collection (password hashing)
        if (collection === 'users' && data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        // Validate and transform data based on collection
        data = validateAndTransformData(collection, data);

        let doc;
        if (collection === 'users') {
            doc = new User(data);
        } else if (collection === 'itenaries') {
            doc = new Itinerary(data);
        } else {
            throw new Error('Invalid collection');
        }

        const savedDoc = await doc.save();

        res.status(201).json({
            success: true,
            id: savedDoc._id,
            message: `Document added to ${collection} successfully`
        });
    } catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to add document'
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});