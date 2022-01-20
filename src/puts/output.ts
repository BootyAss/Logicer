// Abstract Parent class of all Outputs

// const Put = require('./put')
import { Put } from './put';
import { Block } from "./../blocks/block";


class Output extends Put {
    constructor(parent: Block, id: number, state = false, connection: Put = null) {
        super(state, parent, id, connection);
    };
};


interface IOutput {
    new(parent: Block, id: number, state?: boolean, connection?: Put): Output;
};


export { Output, IOutput };