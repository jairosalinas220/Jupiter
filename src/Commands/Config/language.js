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
                let ckeck = await this.client.db.guild.findOne({guildID: msg.guild.id, language: 'en-US'})
                if(ckeck) return msg.channel.send(msg.translate('Config/lang:NO_NEW'))
                let lang = await this.client.db.guild.findOne({guildID: msg.guild.id})
                if(!lang) lang = new this.client.db.guild({ guildID: msg.guild.id, language: 'en-US', prefix: ';;' })
                lang.language = 'en-US'
                await lang.save()
                msg.channel.send('New language set: `es-US | English`')
                break;
            }
            case 'español':
            case 'spanish':
            case 'es-ES': {
                let ckeck = await this.client.db.guild.findOne({guildID: msg.guild.id, language: 'es-ES'})
                if(ckeck) return msg.channel.send(msg.translate('Config/lang:NO_NEW'))
                let lang = await this.client.db.guild.findOne({guildID: msg.guild.id})
                if(!lang) lang = new this.client.db.guild({ guildID: msg.guild.id, language: 'es-ES', prefix: ';;' })
                lang.language = 'es-ES'
                await lang.save()
                msg.channel.send('Nuevo idioma establecido: `es-ES | Español`')
                break;
            }
            case 'tipos':
            case 'list':
            case 'types': {
                msg.channel.send(msg.translate('Config/lang:TYPES', {prefix: this.prefix}))
                break;
            }
            default: {
                msg.channel.send(msg.translate('Config/lang:VALID', {prefix: this.prefix}))
            }
        }
    }
}