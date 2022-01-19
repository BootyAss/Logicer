const Input = require('./input')

module.exports = class SchemeInput extends Input {
    constructor(parent, id, state = true, connection = null) {
        super(state, parent, id, connection);
        this.defaultSctate = true;
    }
}