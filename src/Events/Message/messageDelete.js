const EventClass = require('../../Utils/Class/eventsClass.js')
module.exports = class Message extends EventClass {
    constructor(client, data) {
        super(client, {
            name: 'messageDelete'
        })
    }
    async run(msg) {
        let msgAttachment;
        let msgEmbed;
        if(msg.attachments.first()){
            let url = msg.attachments.first().url;
            msgAttachment = new Discord.MessageAttachment(url, msg.attachments.first().name)
        }
        if(msg.embeds[0]) msgEmbed = msg.embeds[0]

        msg.guild.channels.cache.get('816747180571230278').send(msg.guild.translate('Events/msgDelete:CONTENT', {
            author: `${msg.author.toString()} | ${msg.author.id}`,
            message: msg.content ? msg.content.length > 1500 ? `${msg.content.slice(0, 1500)}...` : msg.content : msg.guild.translate('Events/msgDelete:NO_CONTENT'),
            att: msgAttachment ? msg.guild.translate('Events/msgDelete:ATT') : msg.guild.translate('Events/msgDelete:NO_ATT'),
            emb: msgEmbed ? msg.guild.translate('Events/msgDelete:EMBED') : msg.guild.translate('Events/msgDelete:NO_EMBED'),
        }), {
            embed: msgEmbed ? msgEmbed : null,
            files: msgAttachment ? [msgAttachment] : null,
            allowedMentions: { users: [] }
        })
    }
}