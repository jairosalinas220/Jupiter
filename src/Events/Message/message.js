const EventClass = require('../../Utils/Class/eventsClass.js');
module.exports = class Message extends EventClass {
    constructor(client, data) {
        super(client, {
            name: 'message'
        })
    }
    async run(msg) {
        const data = {}
        let prefix = ';;'
        if (msg.guild) {
            const guild = await this.client.findGuild(msg.guild.id)
            data.guild = guild
            msg.guild.data = guild
            const modelo = await this.client.db.guild.findOne({ guildID: msg.guild.id });
            prefix = modelo ? modelo.prefix : ';;';
        }

        const prefixes = [prefix, `<@${this.client.user.id}>`, `<@!${this.client.user.id}>`, 'jupiter'];
        const usedPrefix = prefixes.find((p) => msg.content.startsWith(p));
        if (!usedPrefix || msg.author.bot) return;
        if (usedPrefix !== prefix) {
            msg.mentions.users.delete(msg.mentions.users.first().id);
        }




        const userMentionRegex = new RegExp(/(?<=(<@&))(\d{17,19})(?=>)/g)
        const userMentionMatch = msg.content.match(regexUser);
        const userMentionsLength = userMentionsMatch.filter(id => msg.guild.members.cache.has(id)).length
        if(userMentionsLength === 5) {
          return msg.reply('Please do not mention several times');
        }
        const inviteRegex = new RegExp(/(?<=(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/).+[A-z]/g)
        const inviteMatch = msg.content.match(inviteMatch)
        if(inviteMatch) {
          const invite = await msg.client.fetchInvite(invite).catch(_ => { });
          if(invite && invite.guild.id === msg.guild.id) {
            return msg.reply('Invitations are forbidden on this server')
          }
        }
        const args = msg.content.slice(usedPrefix.length).trim().split(/ +/g)
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