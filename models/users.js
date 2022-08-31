const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        birthdate: Date,
        password: String,
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);
