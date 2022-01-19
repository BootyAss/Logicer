const Input = require('./input')

module.exports = class UnitInput extends Input {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
}