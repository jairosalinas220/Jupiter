require('dotenv').config()
const path = require('path')
require(path.join(__dirname, 'Utils', 'extenders.js'))
global.Discord = require('discord.js')
const Jupiter = require('./Utils/Class/clientClass')
const client = new Jupiter()

const init = async () => {

    client.loadCommands()
        .loadEvents()
        .connectDataBase()
    const languages = require(path.join(__dirname, 'Utils', 'languages.js'))
    client.translations = await languages()
    client.login(process.env.TOKEN)

};
init()