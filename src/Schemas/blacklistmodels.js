const mongoose = require('mongoose');

const blackListModel = new mongoose.Schema({
    userName: {type: String, required: false, unique: false},
    userID: { type: String, required: true, unique: true},
    duration: {},
    reason: {type: String, required: true}
});

const model = mongoose.model('blackListModel', blackListModel);

module.exports = model;