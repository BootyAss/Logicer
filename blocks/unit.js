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
        let inps = Object.values(this.inps);
        let inputVec = inps.map(put => put.state ? '1' : '0').join('');
        let vecIndex = parseInt(inputVec, 2);
        for (let i of Object.keys(this.outs)) {
            this.outs[i].state = this.outVec[i][vecIndex];
        }
    }
};