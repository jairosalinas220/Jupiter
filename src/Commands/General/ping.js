const BaseCommand = require('../../Utils/Class/commandClass')
module.exports = class PingCommand extends BaseCommand {
    constructor(client, options){
        super(client, {
            name: 'ping',
            aliases: ['latencia'],
            dir: __dirname
        })
    }
    async run(msg, args){
        console.log(this)
        msg.channel.send(msg.translate('General/ping:MS', {ms: this.client.ws.ping}))
    }
}