const Output = require('./output')

module.exports = class SchemeOutput extends Output {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
}