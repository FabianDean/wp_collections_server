const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const bcrypt = require('bcrypt');
const UserSchema = require('./UserSchema');
const saltRounds = 10;

const User = mongoose.model('User', UserSchema);

User.schema.statics = {
    getUsers: async () => {
        return User.find({}).exec();
    },

    addUser: async (user) => {
        try {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            return User.create({
                ...user,
                password: hashedPassword,
                premium: 'false',
                date_created: DateTime.utc().toISODate(),
            });
        } catch (error) {
            throw error;
        }
    },
};

User.schema.methods = {
    matchingUser: async (email, password) => {
        let user;
        let match;

        try {
            user = await User.findOne({ email }).exec();
            match = await bcrypt.compare(password, user.password);
        } catch (error) {
            return false;
        }

        return match ? user : false;
    },
};

module.exports = User;
