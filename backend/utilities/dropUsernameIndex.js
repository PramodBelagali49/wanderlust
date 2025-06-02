require('dotenv').config();
const mongoose = require('mongoose');

async function dropUsernameIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        const collection = mongoose.connection.collection('users');
        
        // Drop the username index
        await collection.dropIndex('username_1');
        console.log('Successfully dropped username index');

    } catch (error) {
        if (error.code === 27) {
            console.log('Index username_1 does not exist - already removed');
        } else {
            console.error('Error:', error);
        }
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

dropUsernameIndex();
