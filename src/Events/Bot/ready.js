const EventClass = require('../../Utils/Class/eventsClass.js')
module.exports = class Ready extends EventClass {
    constructor(client, data) {
        super(client, {
            name: 'ready'
        })
    }
    async run() {
        console.log(`Estoy listo como: ${this.client.user.tag}`)
    }
}