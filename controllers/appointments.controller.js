const dbClient = require('../utils/').dbClient;
const database = dbClient.db(process.env.MONGO_DB_DATABASE);
const collection = database.collection('appointments');

exports.findAll = async (req, res) => {
    const data = await collection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'participants',
                foreignField: '_id',
                as: 'populatedParticipants',
            },
        },
        {
            $project: {
                location: 1,
                subject: 1,
                start: 1,
                end: 1,
                participants: '$populatedParticipants',
            },
        },
    ]);
};
exports.findOne = async (req, res) => {};
exports.create = async (req, res) => {};
exports.updateOne = async (req, res) => {};
exports.deleteOne = async (req, res) => {};
