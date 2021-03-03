const { Message, Guild } = require('discord.js')

Guild.prototype.translate = function(key, args) {
    const data = this.client.translations.get(this.data.language || 'en-US')
    if(!data) {
        throw 'No se encontro el idioma'
    }
    return data(key, args)
}

Message.prototype.translate = function(key, args) {
    
    const data = this.client.translations.get(this.guild ? this.guild.data.language : 'en-US')
    if(!data) {
        throw 'No se encontro el idioma'
    }
    return data(key, args)
}