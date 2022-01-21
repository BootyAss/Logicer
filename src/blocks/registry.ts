// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');

import { Block } from './block';
import { Unit } from './unit';
import { Sets } from './../settings';


class Registry extends Block {
    units: object = {};


    constructor(id: number, outVec = { 0: [false, false] }) {
        super(id, outVec, null, null);

        this.div.className += ' registry';
    };
}

export { Registry };