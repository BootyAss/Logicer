const Block = require('./block');
const UnitInput = require('./../puts/unitInput');
const UnitOutput = require('./../puts/unitOutput');

module.exports = class Unit extends Block {
    constructor(id, outVec) {
        super(id, outVec, UnitInput, UnitOutput);

        this.addPutsByOutVec();
    }

    addInput = () => {
        this.addPut(this.inps, this.inputType);
    }

    addOutput = () => {
        let id = this.addPut(this.outs, this.outputType);
    }

    addPutsByOutVec = () => {
        let outLen = Object.keys(this.outVec).length;
        for (let i = 0; i < outLen; i++)
            this.addOutput();

        let inpLen = Math.log2(this.outVec[0].length);
        for (let i = 0; i < inpLen; i++)
            this.addInput();
    }

    checkToShowOutput = () => {
        let inps = Object.values(this.inps);
        let allConnected = inps.every(put => put.connection !== null);
        if (!(allConnected))
            return
        this.showOutput();
    }

    showOutput = () => {
        let outs = Object.values(this.outs);
        let oldOutput = outs.map(put => put.state ? '1' : '0').join('');
        let oldVecIndex = parseInt(oldOutput, 2);

        let inps = Object.values(this.inps);
        for (let i of Object.keys(inps)) {
            this.inps[i].state = this.inps[i].connection.state;
        }

        let newOutput = inps.map(put => put.state ? '1' : '0').join('');
        let newVecIndex = parseInt(newOutput, 2);

        // let changed = oldVecIndex != newVecIndex;
        for (let i of Object.keys(outs)) {
            this.outs[i].state = this.outVec[i][newVecIndex];
            if (this.outs[i].connection) {
                this.outs[i].connection.parent.checkToShowOutput();
            }
        }
    }
};