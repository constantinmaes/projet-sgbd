// seed.js (à la racine du projet)
require('dotenv').config();

const dbClient = require('./utils/db-client.util');

const seed = async () => {
    const db = await dbClient.db(process.env.MONGO_DB_DATABASE);

    const collections = ['users', 'appointments', 'modules'];

    const existingCollectionsCursor = await db.listCollections();
    const existingCollections = await existingCollectionsCursor.toArray();
    const names = existingCollections.map((c) => c.name);

    collections.forEach(async (c) => {
        try {
            if (names.includes(c)) {
                await db.dropCollection(c);
            }
            await db.createCollection(c);
        } catch (e) {
            console.error(c, e);
        }
    });

    // DTO = DATA TRANSFER OBJECT
    const hash = await require('bcrypt').hash('1234', 10);

    const userDto = {
        name: {
            first: 'Saul',
            middle: 'M.',
            last: 'Goodman',
        },
        email: 'saul.goodman@gmail.com',
        address: {
            street: 'Place de la Justice',
            nbr: 1,
            postCode: 7700,
            city: 'Mouscron',
            country: 'Belgium',
        },
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createdUser = await db.collection('users').insertOne(userDto);

    console.log(createdUser.insertedId);

    const appointmentDto = {
        end: new Date('2023-02-01T11:00:00'),
        start: new Date('2023-02-01T10:00:00'),
        subject: 'Test',
        location: 'Secrétariat',
        participants: [createdUser.insertedId],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.collection('appointments').insertOne(appointmentDto);
};

seed();
