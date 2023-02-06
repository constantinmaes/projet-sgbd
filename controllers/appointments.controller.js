const Joi = require('joi');
const { ObjectId } = require('mongodb');

const dbClient = require('../utils/').dbClient;
const database = dbClient.db(process.env.MONGO_DB_DATABASE);
const collection = database.collection('appointments');

exports.findAll = async (req, res) => {
    const data = await collection
        .aggregate([
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
        ])
        .toArray();

    return res.status(200).json(data);
};
exports.findOne = async (req, res) => {};

exports.create = async (req, res) => {
    const { body } = req;

    // end: date+h + futur + requis + postérieure à start
    // start: date+h + futur + requis
    // subject: string + max 150 + requis
    // description: pas obligatoire + string + max 1500
    // location: string + requis
    // participants: array > string + min 2 elements
    const schema = Joi.object({
        start: Joi.date().min('now').required(),
        end: Joi.date().greater(Joi.ref('start')).required(),
        subject: Joi.string().max(150).required(),
        description: Joi.string().max(1500),
        location: Joi.string().required(),
        participants: Joi.array().items(Joi.string()).min(2),
    });

    const { value, error } = schema.validate(body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const data = await collection
        .insertOne({
            ...value,
            participants: value.participants.map((el) => new ObjectId(el)),
        })
        .catch((err) => {
            console.error(err);
            return { error: 'Impossible to save this record !' };
        });

    res.status(201).json(data);
};

exports.updateOne = async (req, res) => {};
exports.deleteOne = async (req, res) => {};
