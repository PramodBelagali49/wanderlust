const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const User = require('../models/user.js');
const { hashPassword } = require('./passwordUtils.js');
require('dotenv').config();

async function migrateListings() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
        console.log('Connected to database');

        // Find or create pramod_belagali user
        let defaultOwner = await User.findOne({ name: 'pramod_belagali' });
        
        if (!defaultOwner) {
            console.log('Creating default user pramod_belagali...');
            // Create default user if not exists
            const hashedPassword = await hashPassword('defaultPassword123');
            defaultOwner = await User.create({
                name: 'pramod_belagali',
                email: 'pramod.belagali@example.com',
                password: hashedPassword,
                isValidatedEmail: true
            });
            console.log('Default user created successfully');
        }

        // Update all listings to have pramod_belagali as owner
        const result = await Listing.updateMany(
            {}, // match all documents
            { owner: defaultOwner._id }
        );

        console.log(`Successfully updated ${result.modifiedCount} listings`);
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
}

migrateListings();