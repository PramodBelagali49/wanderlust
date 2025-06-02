const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
    try {
        // Connect to MongoDB using the same URL as in app.js
        const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB for fixing indexes...');

        // Get the users collection
        const collection = mongoose.connection.collection('users');
        
        // Get all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);
        
        // Find and drop the username index if it exists
        const usernameIndex = indexes.find(index => index.key.username === 1);
        if (usernameIndex) {
            await collection.dropIndex('username_1');
            console.log('Successfully dropped the username index');
        } else {
            console.log('Username index not found - no action needed');
        }

        console.log('Database fix completed successfully');
    } catch (error) {
        console.error('Error fixing database:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Run the fix
fixDatabase(); 