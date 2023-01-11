const dbClient = require('../utils/').dbClient;
const database = dbClient.db(process.env.MONGO_DB_DATABASE);
const collection = database.collection('users');

exports.list = async (req, res) => {
    console.log('je suis la fonction list du contrôleur users');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
};
