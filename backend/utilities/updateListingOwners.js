const mongoose = require('mongoose');
const Listing = require('../models/listing');
const User = require('../models/user');
require('dotenv').config();

async function updateListingOwners() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust");
        console.log('Connected to MongoDB...');

        // Find Pramod's user account - using username instead of full name
        const owner = await User.findOne({ username: "pramod_belagali" });
        if (!owner) {
            throw new Error('Owner not found. Please make sure the user exists with username: pramod_belagali');
        }

        // Update all listings to have this owner
        const result = await Listing.updateMany(
            {}, // match all documents
            { 
                $set: { 
                    owner: owner._id,
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} listings to owner: ${owner.username}`);
    } catch (error) {
        console.error('Error updating listings:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Run the update
updateListingOwners(); 