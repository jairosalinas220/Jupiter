const EventClass = require('../../Utils/Class/eventsClass.js');
const Discord = require('discord.js')
module.exports = class guildMemberUpdate extends EventClass {
    constructor(client, data) {
        super(client, {
            name: 'messageDelete'
        })
    }
    async run(oldMember, newMember) {
        const channel = newMember.guild.channels.resolve('816747180571230278');
        if(
            !channel || 
            !channel.permissionsFor(newMember.guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
        ) return;
        const embed = new Discord.MessageEmbed();
        embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic: true }));
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            embed.setColor("RED");
            oldMember.roles.cache.forEach(role => {
                if (!newMember.roles.cache.has(role.id)) {
                    embed.addField('Role removed', role);
                }
            });
        } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            embed.setColor("GREEN");
            newMember.roles.cache.forEach(role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    embed.addField('Added role', role);
                }
            });
        }
        else if (oldMember.nickname !== newMember.nickname) {
          embed.setColor("GREEN")
          embed.setDescription(`**${newMember} Nickname change**`)
          embed.addField("Before", oldMember.nickname || "Without nickname")
          embed.addField("After", newMember.nickname || "Without nickname");
        }
        else if (oldMember.user.username !== newMember.user.username) {
          embed.setColor("GREEN")
          embed.setDescription(`**${newMember} Change username**`)
          embed.addField("Before", oldMember.user.username)
          embed.addField("After", newMember.user.username)
        }
        else if (oldMember.user.discriminator !== newMember.user.discriminator){
          embed.setColor('#68a3e4')
          embed.setDescription(`**${newMember} Discriminator change**`)
          embed.addField("Before", oldMember.user.discriminator)
          embed.addField("After", newMember.user.discriminator)
        }
        else if (oldMember.user.avatar !== newMember.user.avatar){
         embed.setColor('#68a3e4')
         embed.setDescription(`**${newMember} Changed avatar**`)
         embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
        }
        canal.send(embed)
    }
}

module.exports = GuildMemberUpdateEvent;