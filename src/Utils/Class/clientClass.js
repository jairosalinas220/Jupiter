const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
module.exports = class Jupiter extends Discord.Client {
    constructor(options) {
        super(options)
        this.commands = new Discord.Collection();
        this.languages = require(path.join(__dirname, '..', 'Lang', 'languages.json'))
        this.db = require(path.join(__dirname, '..', '..', 'Database', 'index.js'))
        this.devs = process.env.DEVS ? process.env.DEVS.split(', ') : [];
        //this.dbCache = {}
        //this.dbCache.guilds = new Discord.Collection()
    }
    loadCommands() {
        const carpeta = path.join(__dirname, '..', '..', 'Commands')
        const categorias = fs.readdirSync(carpeta).filter(f => fs.statSync(path.join(carpeta, f)).isDirectory())
        for (const categoria of categorias) {
            const commands = fs.readdirSync(path.join(carpeta, categoria)).filter(f => f.endsWith('.js'))
            for (const command of commands) {
                const commandContent = require(path.join(carpeta, categoria, command))
                const commandClass = new commandContent(this)
                this.commands.set(commandClass.name, commandClass)
            }
        }
        return this;
    }
    loadEvents() {
        const carpeta = path.join(__dirname, '..', '..', 'Events')
        const categorias = fs.readdirSync(carpeta).filter(f => fs.statSync(path.join(carpeta, f)).isDirectory());
        for (const categoria of categorias) {
            const events = fs.readdirSync(path.join(carpeta, categoria)).filter(f => f.endsWith('.js'))
            for (const event of events) {
                const eventContent = require(path.join(carpeta, categoria, event))
                const eventClass = new eventContent(this);
                this.on(eventClass.name, (...args) => eventClass.run(...args))
            }
        }
        return this;
    }
    async connectDataBase() {
        const connect = await mongoose.connect(process.env.MONGO_KEY, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Conectado a MongoDB')
        return connect;
    }
    defaultLang() {
        return this.languages.find((l) => l.default).name
    }
    translate(key, args, locate) {
        if (!locate) {
            locate = this.defaultLang
        }
        const data = this.translations.get(locate)
        if (!data) {
            throw 'No se encontro un idioma disponible'
        }
        return data(key, args);
    }
    async findGuild(guildID) {
        //if(this.dbCache.guilds.get(guildID)) {
        // return this.dbCache.guild.get(guildID).toJSON()
        //} else {
        let guild = await this.db.guild.findOne({ guildID })
        if (guild) {
            return guild
        } else {
            guild = new this.db.guild({ guildID, language: 'en-US', prefix: ';;' })
            await guild.save()
            //this.dbCache.guilds.set(guildID, guild)
            return guild
        }
        //}
    }
}