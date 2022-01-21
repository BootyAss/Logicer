// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');
import { Block } from './block.js';
class Registry extends Block {
    constructor(id, outVec = { 0: [false, false] }) {
        super(id, outVec, null, null);
        this.units = {};
        this.div.className += ' registry';
    }
    ;
}
export { Registry };
