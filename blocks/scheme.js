const Block = require('./block');
const Unit = require('./unit');

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

    checkToShowOutput = () => {
        for (let i of Object.keys(this.outs))
            if (this.outs[i].connection)
                this.outs[i].state = this.outs[i].connection.state;
    }

    saveAsUnit = (id) => {
        let outputVectors = {};
        let vectorLen = Math.pow(2, Object.keys(this.inps).length);
        for (let i of Object.keys(this.outs)) {
            outputVectors[i] = new Array(vectorLen).fill(0);
        }

        let iter = 0;
        for (let i = 0; i < vectorLen; i++) {
            let binVal = iter.toString(2);
            this.setInputs(binVal);
            for (let j of Object.keys(this.outs)) {
                console.log('output ' + j + ' =' + this.outs[j].state);
                outputVectors[j][i] = this.outs[j].state;
            }
            iter++;
        }

        return new Unit(id, outputVectors);
    }

    setInputs = (binVal) => {
        let iter = 0;
        for (let i of Object.keys(this.inps)) {
            let bin = Boolean(parseInt(binVal[iter]));
            this.inps[i].setState(bin);
            iter++;
        }

    }

};