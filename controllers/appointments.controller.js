const dbClient = require('../utils/').dbClient;
const database = dbClient.db(process.env.MONGO_DB_DATABASE);
const collection = database.collection('appointments');

exports.findAll = async (req, res) => {};
exports.findOne = async (req, res) => {};
exports.create = async (req, res) => {};
exports.updateOne = async (req, res) => {};
exports.deleteOne = async (req, res) => {};
