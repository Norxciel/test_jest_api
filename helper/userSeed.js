require('dotenv').config();
const getDbInstance = require('./database');
const User = require('../models/users');

const users = require('../constants/usersFaker');

// connexion à la bdd

const runSeed = async () => {
    const db = await getDbInstance();
    await User.deleteMany({});
    await User.insertMany(users);

    db.connection.close();
};

runSeed();
