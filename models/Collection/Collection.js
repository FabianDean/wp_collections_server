const mongoose = require('mongoose');
const CollectionSchema = require('./CollectionSchema');

const Collection = mongoose.model('Collection', CollectionSchema);

module.exports = Collection;
