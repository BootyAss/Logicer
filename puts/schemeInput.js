// const Input = require('./input')
import { Input } from './input.js';

export class SchemeInput extends Input {
    constructor(parent, id, state = true, connection = null) {
        super(state, parent, id, connection);
        this.defaultState = true;
    }
}