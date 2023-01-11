const dbClient = require('../utils/').dbClient;
const database = dbClient.db(process.env.MONGO_DB_DATABASE);
const collection = database.collection('users');

exports.findAll = async (req, res) => {
    console.log('je suis la fonction list du contrôleur users');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
};

exports.findOne = async (req, res) => {};
exports.create = async (req, res) => {};
exports.updateOne = async (req, res) => {};
exports.deleteOne = async (req, res) => {};
