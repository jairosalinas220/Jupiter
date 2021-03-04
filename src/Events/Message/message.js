const EventClass = require('../../Utils/Class/eventsClass.js')
module.exports = class Message extends EventClass {
    constructor(client, data) {
        super(client, {
            name: 'message'
        })
    }
    async run(msg) {
        const data = {}
        if (msg.author.bot) return;
        if (msg.guild) {
            const guild = await this.client.findGuild(msg.guild.id)
            data.guild = guild
            msg.guild.data = guild
        }
        const prefix = this.client.findPrefix(msg, data)
        if (!prefix) return;
        const args = msg.content.slice(typeof prefix === 'string' ? prefix.length : 0).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        const cmd = this.client.commands.find(c => c.name === command || c.aliases.includes(command))
        if (!cmd) return;
        if (!cmd.canRun(msg)) return;
        try {
            cmd.serverPrefix = prefix
            cmd.run(msg, args)
        } catch (err) {
            console.log(err)
        }
    }
}