// Abstract Parent class of all Outputs

// const Put = require('./put')
import { Put } from './put.js';

export class Output extends Put {
    constructor(state, parent, id, connection) {
        super(state, parent, id, connection);
    }
}