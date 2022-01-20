// Abstract Parent class of all Inputs

// const Put = require('./put')
import { Put } from './put';
import { Block } from "./../blocks/block";


class Input extends Put {
    constructor(parent: Block, id: number, state = false, connection: Put = null) {
        super(state, parent, id, connection);
    };
};


interface IInput {
    new(parent: Block, id: number, state?: boolean, connection?: Put): Input;
}


export { Input, IInput };