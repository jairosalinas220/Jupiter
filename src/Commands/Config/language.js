const BaseCommand = require('../../Utils/Class/commandClass')
module.exports = class PingCommand extends BaseCommand {
    constructor(client, options) {
        super(client, {
            name: 'language',
            aliases: ['setlanguage', 'lang', 'setlanguage'],
            dir: __dirname,
            memberGuildPermissions: ['ADMINISTRATOR']
        })
    }
    async run(msg, args) {
        if (!args[0]) return msg.channel.send(msg.translate('Config/lang:VALID', { prefix: this.prefix }))
        switch (args[0]) {
            case 'ingles':
            case 'english':
            case 'en-US': {
                let ckeck = this.client.db.guild.findOne({guildID: msg.guild.id, language: 'en-US'})
                if(ckeck) return msg.channel.send(msg.translate('Config/lang:NO_NEW'))
                let lang = this.client.db.guild.findOne({guildID: msg.guild.id})
                if(!lang) lang = new this.db.guild({ guildID: msg.guild.id, language: 'en-US', prefix: ';;' })
                lang.language = 'en-US'
                await lang.save()
                msg.channel.send(msg.translate('Config/lang:OK', {lang: 'en-US | English'}))
                break;
            }
            case 'español':
            case 'spanish':
            case 'es-ES': {
                let ckeck = this.client.db.guild.findOne({guildID: msg.guild.id, language: 'en-US'})
                if(ckeck) return msg.channel.send(msg.translate('Config/lang:NO_NEW'))
                let lang = this.client.db.guild.findOne({guildID: msg.guild.id})
                if(!lang) lang = new this.db.guild({ guildID: msg.guild.id, language: 'en-US', prefix: ';;' })
                lang.language = 'en-US'
                await lang.save()
                msg.channel.send(msg.translate('Config/lang:OK', {lang: 'es-ES | Español'}))
                break;
            }
            case 'tipos':
            case 'list':
            case 'types': {
                msg.channel.send(msg.translate('Config/lang:TYPES', {prefix: this.prefix}))
            }
            default: {
                msg.channel.send(msg.translate('Config/lang:VALID', {prefix: this.prefix}))
            }
        }
    }
}