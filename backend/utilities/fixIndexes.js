require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function fixIndexes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        // Get collection
        const collection = mongoose.connection.collection('users');

        // List current indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the problematic username index if it exists
        const usernameIndex = indexes.find(index => index.key.username === 1);
        if (usernameIndex) {
            await collection.dropIndex('username_1');
            console.log('Dropped username index');
        }

        // Create email index
        await collection.createIndex({ email: 1 }, { unique: true });
        console.log('Created unique email index');

        console.log('Index cleanup completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

fixIndexes();
