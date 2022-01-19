const Output = require('./output')

module.exports = class UnitOutput extends Output {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
}