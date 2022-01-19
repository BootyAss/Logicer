// Abstract Parent class of all Outputs

const Put = require('./put')

module.exports = class Output extends Put {
    constructor(state, parent, id, connection) {
        super(state, parent, id, connection);
    }
}