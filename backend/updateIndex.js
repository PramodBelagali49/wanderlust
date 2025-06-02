const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function updateIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        await User.collection.dropIndex('email_1').catch(() => console.log('No existing email index to drop'));
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('Email index created successfully');
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateIndex();
