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

    if (error) {
        return res.status(400).json({ message: error });
    }

    const data = await collection.insertOne(value).catch((err) => {
        return { error: 'Impossible to save this record !' };
    });

    res.status(201).json(data);
};

exports.updateOne = async (req, res) => {
    // rdv origine : participants: [a, b]
    // req.body { participants: [a, b, c]}

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'No id provided' });
    }

    const { body } = req;

    const schema = Joi.object({
        start: Joi.date().min('now').required(),
        end: Joi.date().greater(Joi.ref('start')),
        subject: Joi.string().max(150),
        description: Joi.string().max(1500),
        location: Joi.string(),
        participants: Joi.array().items(Joi.string()).min(2),
    });

    const { error, value } = await schema.validateAsync(body);

    if (error) {
        return res.status(400).json(error);
    }

    let updateValue;

    if (!value.participants) {
        // supprimer la clé participants de l'objet à insérer
        delete value.participants;
        updateValue = { ...value };
    } else {
        // caster les strings en ObjectId
        updateValue = {
            ...value,
            participants: value.participants.map((el) => new ObjectId(el)),
        };
    }

    const data = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: updateValue,
        },
        {
            returnDocument: 'after',
        }
    );

    res.status(200).json(data);
};
exports.deleteOne = async (req, res) => {};

exports.findParticipants = async (req, res) => {
    const { id } = req.params;

    // gestion des erreurs à développer

    const data = await collection
        .aggregate([
            { $match: { _id: new ObjectId(id) } },
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
                    participants: '$populatedParticipants',
                },
            },
        ])
        .toArray();

    if (data.length === 0) {
        res.status(404).json({ message: 'No appointment found' });
    } else {
        res.status(200).json(data[0].participants);
    }
};

exports.addParticipant = async (req, res) => {
    const { id } = req.params;

    const { body } = req;

    // gestion erreurs à développer

    const data = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { participants: new ObjectId(body.participantId) } },
        { returnDocument: 'after' }
    );

    res.status(201).json({ message: 'Particpant added' });
};
