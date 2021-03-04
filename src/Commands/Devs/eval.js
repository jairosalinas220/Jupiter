const BaseCommand = require('../../Utils/Class/commandClass')
const Util = require('util')
module.exports = class PingCommand extends BaseCommand {
    constructor(client, options) {
        super(client, {
            name: 'eval',
            aliases: ['e'],
            dir: __dirname,
            devsOnly: true
        })
    }
    async run(msg, args) {
        args = args.join(' ');
        if (!args) return msg.channel.send('What do you evaluate?');
        try {
            let evalued;
            let type;
            if (args.endsWith('-a')) {
                args = args.slice(0, -2);
                evalued = await eval('(async() => {\n' + args + '\n})();');
                type = typeof (evalued);
                type = type[0].toUpperCase() + type.slice(1).toLowerCase();
                if (typeof (evalued) !== 'string') {
                    evalued = Util.inspect(evalued, { depth: 0, showHidden: true });
                }
            } else {
                evalued = eval(args);
                type = typeof (evalued);
                type = type[0].toUpperCase() + type.slice(1).toLowerCase();
                if (typeof (evalued) !== 'string') {
                    evalued = Util.inspect(evalued, { depth: 0, showHidden: true });
                }
            }
            msg.channel.send(`**[${type}]** ${this.client.ws.ping}ms.\n${this.block(evalued, 'js')}`)
        } catch (err) {
            msg.channel.send(`**[${err.name || 'Error'}]** ${this.client.ws.ping}ms.\n${this.block(err.message || err, 'js')}`)
        }
    }
    block(str, lang) {
        const text = [`\`\`\`${lang}`,
        typeof (str) !== 'string' ? str : str.replace(/`/g, '`\u200b').slice(0, 1900),
            '```'];

        return text.join('\n')
            .replace(new RegExp(process.env.TOKEN, 'gi'), 'Discord Token')
            .replace(new RegExp(process.env.MONGO_KEY, 'gi'), 'MongoDB URI');
    }
}