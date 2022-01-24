// const Output = require('./output')
import { Put } from './put';
import { Output } from './output';
import { Block } from "./../blocks/block";


class SchemeOutput extends Output {
    constructor(parent: Block, id: number, state = false, connection: Put = null) {
        super(parent, id, state, connection);
        this.div.id = 'scheme output ' + this.id;
    };
};


export { SchemeOutput };