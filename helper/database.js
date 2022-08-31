/* eslint-disable no-console */
const mongoose = require('mongoose');

const getDbInstance = () => {
    try {
        const uri = process.env.DB_DEV_URI;
        const db = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // When successfully connected
        mongoose.connection.on('connected', () =>
            console.log('Mongoose default connection open')
        );

        // If the connection throws an error
        mongoose.connection.on('error', (err) =>
            console.log(`Mongoose default connection error: ${err}`)
        );

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log(
                    'Mongoose default connection disconnected through app termination'
                );
                process.exit(0);
            });
        });
        return db;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

module.exports = getDbInstance;
