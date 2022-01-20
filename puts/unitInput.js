// const Input = require('./input')
import { Input } from './input.js';

export class UnitInput extends Input {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
}