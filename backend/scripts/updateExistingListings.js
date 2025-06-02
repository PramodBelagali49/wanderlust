const mongoose = require('mongoose');
const Listing = require('../models/listing');
const User = require('../models/user');

// MongoDB connection string
const dbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

async function updateExistingListings() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Find the user with name "pramod_belagali"
        const defaultOwner = await User.findOne({ name: "pramod_belagali" });

        if (!defaultOwner) {
            console.error('Default owner not found');
            return;
        }

        // Update all listings to have pramod_belagali as owner
        const result = await Listing.updateMany(
            {}, // Empty filter to match all documents
            { $set: { owner: defaultOwner._id } }
        );

        console.log(`Updated ${result.modifiedCount} listings`);
        
        // Verify the update
        const totalListings = await Listing.countDocuments();
        console.log(`Total listings in database: ${totalListings}`);
        
        const listingsWithOwner = await Listing.countDocuments({ owner: defaultOwner._id });
        console.log(`Listings with pramod_belagali as owner: ${listingsWithOwner}`);

        console.log('Update completed successfully');

    } catch (error) {
        console.error('Error updating listings:', error);
    } finally {
        await mongoose.connection.close();
    }
}

updateExistingListings(); 