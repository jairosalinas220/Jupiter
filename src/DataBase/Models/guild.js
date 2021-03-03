const { Schema, model } = require('mongoose')
const guild = Schema({
    guildID: {
        type: String,
        unique: true
    },
    language: {
        type: String,
        default: 'en-US'
    },
    prefix: {
        type: String,
        default: ';;'
    }
});
module.exports = model('guild', guild)