module.exports = class BaseCommand {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.category = options.dir.split(/\\/g)[options.dir.split(/\\/g).length - 1] || 'General';
        this.botGuildPermissions = options.botGuildPermissions || [];
        this.botChannelPermissions = options.botChannelPermissions || [];
        this.memberGuildPermissions = options.memberGuildPermissions || [];
        this.memberChannelPermissions = options.memberChannelPermissions || [];
        this.cooldown = options.cooldown || 2;
        this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
        this.guildOnly = typeof options.guildOnly === 'boolean' ? options.guildOnly : this.category !== 'General';
        this.nsfwOnly = typeof options.nsfwOnly === 'boolean' ? options.nsfwOnly : false;
        this.devsOnly = typeof options.devsOnly === 'boolean' ? options.devsOnly : false;
        this.cooldowns = new Discord.Collection();
    }
    set serverPrefix(prefix) {
        this.prefix = prefix
    }
    canRun(msg) {
        if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return false;
        //if (this.checkCooldowns(msg)) return !msg.channel.send(`You have to wait **${Number((this.cooldowns.get(msg.author.id) - Date.now()) / 1000).toFixed(2)}s** to execute this command.`);
        if (this.checkCooldowns(msg)) return !msg.channel.send(msg.translate('Responses/canRun:COOLDOWN', { sec: Number((this.cooldowns.get(msg.author.id) - Date.now()) / 1000).toFixed(2) }));
        //if (!this.enabled && !this.client.devs.includes(msg.author.id)) return !this.sendOrReply(msg, 'This command is under maintenance.', { allowedMentions: { users: [] } });
        if (!this.enabled && !this.client.devs.includes(msg.author.id)) return !this.sendOrReply(msg, msg.translate('Responses/canRun:ENABLED'), { allowedMentions: { users: [] } });
        //if (this.guildOnly && !msg.guild) return !this.sendOrReply(msg, 'This command is only available for servers.', { allowedMentions: { users: [] } });
        if (this.guildOnly && !msg.guild) return !this.sendOrReply(msg, msg.translate('Responses/canRun:GUILD'), { allowedMentions: { users: [] } });
        //if (this.devsOnly && !this.client.devs.includes(msg.author.id)) return !this.sendOrReply(msg, 'This command can only be used by developers only.', { allowedMentions: { users: [] } });
        if (this.devsOnly && !this.client.devs.includes(msg.author.id)) return !this.sendOrReply(msg, msg.translate('Responses/canRun:DEVS'), { allowedMentions: { users: [] } });
        //if (msg.guild && !msg.channel.nsfw && this.nsfwOnly) return !this.sendOrReply(msg, 'This command can only be used on NSFW channels.', { allowedMentions: { users: [] } });
        if (msg.guild && !msg.channel.nsfw && this.nsfwOnly) return !this.sendOrReply(msg, msg.translate('Responses/canRun:NSFW'), { allowedMentions: { users: [] } });

        //if (msg.guild && this.memberGuildPermissions[0] && !this.memberGuildPermissions.some((x) => msg.member.permissions.has(x)) && !this.client.devs.includes(msg.author.id))
        //    return !this.sendOrReply(msg, `You need the following permissions: \`${this.memberGuildPermissions.map(this.parsePermission).join(', ')}\``, { allowedMentions: { users: [] } });
        if (msg.guild && this.memberGuildPermissions[0] && !this.memberGuildPermissions.some((x) => msg.member.permissions.has(x)) && !this.client.devs.includes(msg.author.id))
            return !this.sendOrReply(msg, msg.translate('Responses:canRun:MEMBER_GUILD', { perms: this.translatePermissions(msg, this.memberGuildPermissions).join(', ') }), { allowedMentions: { users: [] } });

        //if (msg.guild && this.memberChannelPermissions[0] && !this.memberChannelPermissions.some((x) => msg.channel.permissionsFor(msg.member).has(x)) && !this.client.devs.includes(msg.author.id))
        //    return !this.sendOrReply(msg, `You need the following permissions on this channel: \`${this.memberChannelPermissions.map(this.parsePermission).join(', ')}\``, { allowedMentions: { users: [] } });
        if (msg.guild && this.memberChannelPermissions[0] && !this.memberChannelPermissions.some((x) => msg.channel.permissionsFor(msg.member).has(x)) && !this.client.devs.includes(msg.author.id))
            return !this.sendOrReply(msg, msg.translate('Responses:canRun:MEMBER_CHANNEL', { perms: this.translatePermissions(msg, this.memberChannelPermissions).join(', ') }), { allowedMentions: { users: [] } });

        //if (msg.guild && this.botGuildPermissions[0] && !this.botGuildPermissions.some((x) => msg.guild.me.permissions.has(x)))
        //  return !this.sendOrReply(msg, `I need the following permissions: \`${this.botGuildPermissions.map(this.parsePermission).join(', ')}\``, { allowedMentions: { users: [] } });
        if (msg.guild && this.botGuildPermissions[0] && !this.botGuildPermissions.some((x) => msg.guild.me.permissions.has(x)))
            return !this.sendOrReply(msg, msg.translate('Responses:canRun:CLIENT_GUILD', { perms: this.translatePermissions(msg, this.botGuildPermissions).join(', ') }), { allowedMentions: { users: [] } });

        //if (msg.guild && this.botChannelPermissions[0] && !this.botChannelPermissions.some((x) => msg.channel.permissionsFor(msg.guild.me).has(x)))
        //  return !this.sendOrReply(msg, `I need the following permissions on this channel: \`${this.botChannelPermissions.map(this.parsePermission).join(', ')}\``, { allowedMentions: { users: [] } });
        if (msg.guild && this.botChannelPermissions[0] && !this.botChannelPermissions.some((x) => msg.channel.permissionsFor(msg.guild.me).has(x)))
          return !this.sendOrReply(msg, msg.translate('Responses:canRun:CLIENT_GUILD', { perms: this.translatePermissions(msg, this.botChannelPermissions).join(', ') }), { allowedMentions: { users: [] } });

        return true;
    }
    checkCooldowns(msg) {
        if (this.cooldowns.has(msg.author.id)) return true;
        this.cooldowns.set(msg.author.id, Date.now() + (this.cooldown * 1000));
        setTimeout(() => {
            this.cooldowns.delete(msg.author.id);
        }, this.cooldown * 1000);
        return false;
    }
    translatePermissions(msg, perms) {
        let array = [];
        for (const perm of perms) {
            array.push(msg.translate(`Responses:perms:${perm}`))
        }
        return array
    }
    sendOrReply(msg, ...args) {
        if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('READ_MESSAGE_HISTORY'))
            return msg.channel.send(...args);
        return msg.reply(...args);
    }
}