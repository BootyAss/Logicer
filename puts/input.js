// Abstract Parent class of all Inputs

// const Put = require('./put')
import { Put } from './put.js';


export class Input extends Put {
    constructor(state, parent, id, connection) {
        super(state, parent, id, connection);
    }
}