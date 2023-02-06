module.exports = {
    validator: {
        $jsonSchema: {
            required: ['email'],
            properties: {
                name: {
                    bsonType: 'object',
                    required: ['first', 'last'],
                    properties: {
                        first: {
                            bsonType: 'string'
                        },
                        middle: {
                            bsonType: 'string'
                        },
                        last: {
                            bsonType: 'string'
                        },
                    }
                }
            }
        }
    }
}