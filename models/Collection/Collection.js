const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { v4: uuid } = require('uuid');
const CollectionSchema = require('./CollectionSchema');

const Collection = mongoose.model('Collection', CollectionSchema);

Collection.schema.statics = {
    createCollection: async (collection, user) => {
        return Collection.create({
            ...collection,
            _id: uuid(),
            owner_id: user._id,
            date_created: DateTime.utc().toISODate(),
        });
    },
};

module.exports = Collection;
