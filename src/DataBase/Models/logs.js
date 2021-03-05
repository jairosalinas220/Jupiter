const { Schema, model } = require('mongoose')
const guild = Schema({
    guildID: {
        type: String,
        unique: true
    },
    messageDelete: {
        type: String,
        default: ''
    }
});
module.exports = model('guild', guild)