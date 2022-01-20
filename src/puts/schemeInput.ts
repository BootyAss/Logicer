// const Input = require('./input')
import { Put } from './put';
import { Input } from './input';
import { Block } from "./../blocks/block";


class SchemeInput extends Input {
    constructor(parent: Block, id: number, state = true, connection: Put = null) {
        super(parent, id, state, connection);
        this.defaultState = true;
    };
};


export { SchemeInput };