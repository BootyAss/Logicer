// Abstract Parent class of all Inputs

const Put = require('./put')

module.exports = class Input extends Put {
    constructor(state, parent, id, connection) {
        super(state, parent, id, connection);
    }
}