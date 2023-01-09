// db-client.util.js

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

(async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error('Failed to connect to MongoDB', e);
        process.exit(1);
    }
})();

module.exports = client;
