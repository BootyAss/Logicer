// const Output = require('./output')
import { Output } from './output.js';

export class UnitOutput extends Output {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
}