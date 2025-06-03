require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/listing');

async function checkListings() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        const count = await Listing.countDocuments();
        console.log(`Total listings in database: ${count}`);
        
        if (count === 0) {
            console.log('No listings found in the database');
        } else {
            const listings = await Listing.find({}).limit(1);
            console.log('Sample listing:', JSON.stringify(listings[0], null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkListings();
