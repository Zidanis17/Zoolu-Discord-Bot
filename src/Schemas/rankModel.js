const mongoose = require('mongoose');

const rankModel = new mongoose.Schema({
    memberID: {type: String, required: true},
    memberName: {type: String, required: true},
    guildID: {type: String, required: true},
    guildName: {type: String, required: true},
    xp: {type: Number, required: true, default: 0},    
    xpTotal: {type: Number, required: true, default: 0},
    level: {type: Number, required: true, default: 1},
    msgNum: {type: Number, required: true, default: 0},
    background: {type: String,  default: 'default' }
});

const model = mongoose.model('rankModel', rankModel);

module.exports = model;