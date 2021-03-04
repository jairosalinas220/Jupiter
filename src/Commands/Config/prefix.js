const BaseCommand = require('../../Utils/Class/commandClass')
module.exports = class PingCommand extends BaseCommand {
    constructor(client, options){
        super(client, {
            name: 'prefix',
            aliases: ['setprefix'],
            dir: __dirname,
            memberGuildPermissions: ['ADMINISTRATOR']
        })
    }
    async run(msg, args){
        if(!args[0]) return msg.channel.send(msg.translate('Config/prefix:ARGS', {prefix: this.prefix}))
        if(args[0].length > 5) return msg.channel.send(msg.translate('Config/prefix:LENGTH', {prefix: this.prefix}))
        let server = await this.client.db.guild.findOne({guildID: msg.guild.id})
        if(!server) new this.client.db.guild({ guildID, language: 'en-US', prefix: args[0] })
        server.prefix = args[0]
        await server.save()
        msg.channel.send(msg.translate('Config/prefix:OK', {newPrefix: args[0]}))
    }
}