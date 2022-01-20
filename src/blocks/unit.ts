// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');

import { Block } from './block';
import { UnitInput } from './../puts/unitInput';
import { UnitOutput } from './../puts/unitOutput';


class Unit extends Block {
    name: string;

    constructor(id: number, outVec: object, name = 'Unit') {
        super(id, outVec, UnitInput, UnitOutput);
        this.name = name;
        this.addPutsByOutVec();

        this.div.className += ' unit';
    };

    addInput = (): number => {
        return this.addPut(this.inps, this.inputType);
    };

    addOutput = (): number => {
        return this.addPut(this.outs, this.outputType);
    };

    addPutsByOutVec = (): void => {
        let outLen = Object.keys(this.outVec).length;
        if (outLen === 0)
            throw "Empty output vector";

        for (let i = 0; i < outLen; i++)
            this.addOutput();

        let inpLen = Math.log2(this.outVec[0].length);
        for (let i = 0; i < inpLen; i++)
            this.addInput();
    };

    checkAllInputs = (): void => {
        let inps: Array<UnitInput> = Object.values(this.inps);
        let allConnected = inps.every(put => put.connection !== null);
        if (allConnected)
            this.calculateOutputs();
        else
            this.clearOutputs();
    };

    calculateOutputs = (): void => {
        // gain states from connections
        for (let i of Object.keys(this.inps)) {
            this.inps[i].setState(this.inps[i].connection.state);
        }

        let inps: Array<UnitInput> = Object.values(this.inps);
        let newOutput = inps.map(put => put.state ? '1' : '0').join('');
        let newVecIndex = parseInt(newOutput, 2);

        // let changed = oldVecIndex != newVecIndex;
        for (let i of Object.keys(this.outs)) {
            this.outs[i].setState(this.outVec[i][newVecIndex]);
            if (this.outs[i].connection) {
                this.outs[i].connection.parent.checkAllInputs();
            }
        }
    };

    clearOutputs = (): void => {
        for (let i of Object.keys(this.outs))
            this.outs[i].state = this.outs[i].defaultState;
    };

    removeSelf = (): void => {
        for (let i of Object.keys(this.inps))
            this.removeInput(i);
        for (let i of Object.keys(this.outs))
            this.removeOutput(i);

    };

    debug = (): void => {
        console.log('Unit ' + this.name + this.id + ':')
        console.log('\tinputs:')
        for (let put of Object.values(this.inps)) {
            console.log(put.debug());
        }
        console.log('\toutputs:')
        for (let put of Object.values(this.outs)) {
            console.log(put.debug());
        }
    };
};


export { Unit };