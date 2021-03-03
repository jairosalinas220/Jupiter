module.exports = class BaseCommand {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.aliases = options.aliases || []
        this.category = options.dir.split(/\\/g)[options.dir.split(/\\/g).length - 1] || 'General'
        this.botsPerms = {
            guild: [],
            channel: []
        }
    }
    set serverPrefix(prefix) {
        this.prefix = prefix
    }
}