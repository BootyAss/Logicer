// const Input = require('./input')
import { Put } from './put';
import { Input } from './input';
import { Block } from "../blocks/block";


class UnitInput extends Input {
    constructor(parent: Block, id: number, state = false, connection: Put = null) {
        super(parent, id, state, connection);
        this.div.id = 'unit input ' + this.id;
    };
};


export { UnitInput };