require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connection;