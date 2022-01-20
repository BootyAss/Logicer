// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');
import { Block } from './block.js';
import { UnitInput } from './../puts/unitInput.js';
import { UnitOutput } from './../puts/unitOutput.js';
class Unit extends Block {
    constructor(id, outVec, name = 'Unit') {
        super(id, outVec, UnitInput, UnitOutput);
        this.addInput = () => {
            return this.addPut(this.inps, this.inputType);
        };
        this.addOutput = () => {
            return this.addPut(this.outs, this.outputType);
        };
        this.addPutsByOutVec = () => {
            let outLen = Object.keys(this.outVec).length;
            if (outLen === 0)
                throw "Empty output vector";
            for (let i = 0; i < outLen; i++)
                this.addOutput();
            let inpLen = Math.log2(this.outVec[0].length);
            for (let i = 0; i < inpLen; i++)
                this.addInput();
        };
        this.checkAllInputs = () => {
            let inps = Object.values(this.inps);
            let allConnected = inps.every(put => put.connection !== null);
            if (allConnected)
                this.calculateOutputs();
            else
                this.clearOutputs();
        };
        this.calculateOutputs = () => {
            // gain states from connections
            for (let i of Object.keys(this.inps)) {
                this.inps[i].setState(this.inps[i].connection.state);
            }
            let inps = Object.values(this.inps);
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
        this.clearOutputs = () => {
            for (let i of Object.keys(this.outs))
                this.outs[i].state = this.outs[i].defaultState;
        };
        this.removeSelf = () => {
            for (let i of Object.keys(this.inps))
                this.removeInput(i);
            for (let i of Object.keys(this.outs))
                this.removeOutput(i);
        };
        this.debug = () => {
            console.log('Unit ' + this.name + this.id + ':');
            console.log('\tinputs:');
            for (let put of Object.values(this.inps)) {
                console.log(put.debug());
            }
            console.log('\toutputs:');
            for (let put of Object.values(this.outs)) {
                console.log(put.debug());
            }
        };
        this.name = name;
        this.addPutsByOutVec();
        this.div.className += ' unit';
    }
    ;
}
;
export { Unit };
