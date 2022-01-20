// const Block = require('./block');
// const Unit = require('./unit');
// const SchemeInput = require('./../puts/schemeInput');
// const SchemeOutput = require('./../puts/schemeOutput');

import { Block } from './block.js';
import { Unit } from './unit.js';
import { SchemeInput } from './../puts/schemeInput.js';
import { SchemeOutput } from './../puts/schemeOutput.js';


export class Scheme extends Block {
    units = {};
    constructor(id, outVec = { 0: [false, false] }) {
        super(id, outVec, SchemeInput, SchemeOutput);
        this.addOutput();
        this.addInput();

        this.div.className = 'scheme';
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

    checkAllInputs = () => {
        for (let i of Object.keys(this.outs))
            if (this.outs[i].connection)
                this.outs[i].setState(this.outs[i].connection.state);
    }


    setInputs = (binVal) => {
        let iter = 0;
        for (let i of Object.keys(this.inps)) {
            let bin = Boolean(parseInt(binVal[iter]));
            this.inps[i].setState(bin);
            iter++;
        }

    }

    addUnit = (inputVal, name = undefined) => {
        if (inputVal instanceof Unit) {
            name = inputVal.name;
            inputVal = inputVal.outVec;
        }

        let id = this.generateId(this.units);
        let unit = new Unit(id, inputVal, name);

        if (unit)
            this.units[id] = unit;

        return id;
    }

    getUnit = (id, name = undefined) => {
        if (!name) {
            return this.units[id];
        }
        return Object.entries(this.units).map(([key, val]) => { if (val.name == name) return key; })
    }

    saveAsUnit = (name = undefined) => {
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
                outputVectors[j][i] = this.outs[j].state;
            }
            iter++;
        }
        return new Unit(null, outputVectors, name);
    }

    removeUnit = (id) => {
        if (id in this.units) {
            this.units[id].removeSelf();
            delete this.units[id];
        }
    }

    clear = () => {
        for (let i of Object.keys(this.inps))
            this.removeInput(i);

        for (let i of Object.keys(this.outs))
            this.removeOutput(i);

        for (let i of Object.keys(this.units))
            this.removeUnit(i);

        this.addOutput();
        this.addInput();

    }



    debug = () => {
        console.log('Scheme:\n\tinputs:')
        for (let put of Object.values(this.inps)) {
            console.log(put.debug());
        }
        console.log('\toutputs:')
        for (let put of Object.values(this.outs)) {
            console.log(put.debug());
        }
        console.log('\tUnits:')
        for (let unit of Object.values(this.units)) {
            unit.debug();
        }
    }
};