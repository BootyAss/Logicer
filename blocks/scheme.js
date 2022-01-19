const Block = require('./block');
const SchemeInput = require('./../puts/schemeInput');
const SchemeOutput = require('./../puts/schemeOutput');

module.exports = class Scheme extends Block {
    constructor(id, outVec = { 0: [false, false] }) {
        super(id, outVec, SchemeInput, SchemeOutput);
        this.addOutput();
        this.addInput();
    }

    addInput = () => {
        this.addPut(this.inps, this.inputType);
        this.recalculateOutputVectors();
    }

    addOutput = () => {
        let id = this.addPut(this.outs, this.outputType);
        this.addOutputVector(id);
    }

    flipInput = (id) => {
        let input = this.inps[id];
        if (!input)
            throw 'no input for ' + id;
        input.flip();
    }

    checkToShowOutput = () => {}
};