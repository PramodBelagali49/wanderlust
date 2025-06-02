const mongoose = require('mongoose');
const User = require('../models/user');

// MongoDB connection string
const dbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

async function createDefaultUser() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Check if user already exists
        let defaultUser = await User.findOne({ name: "pramod_belagali" });

        if (!defaultUser) {
            // Create the default user
            defaultUser = new User({
                name: "pramod_belagali",
                email: "pramod@wanderlust.com",
                password: "hashedpassword123", // In a real app, this should be properly hashed
                isValidatedEmail: true
            });

            await defaultUser.save();
            console.log('Default user created successfully');
        } else {
            console.log('Default user already exists');
        }

        return defaultUser._id;

    } catch (error) {
        console.error('Error creating default user:', error);
    } finally {
        await mongoose.connection.close();
    }
}

createDefaultUser(); 