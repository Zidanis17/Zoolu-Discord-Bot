const mongoose = require('mongoose');

const guildModel = new mongoose.Schema({
    guildID: {type: String, required: true, unique:true},
    guildName: {type: String, required: true},
    disabledCommands: {type: Array, default: []},
    welcomeChannel: {type: Object, default: {channel: null, message: null}},
    leaveChannel: {type: Object, default: {channel: null, message: null}}
});

const model = mongoose.model('guildModel', guildModel);

module.exports = model;