// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');

import { Block } from './block';
import { UnitInput } from './../puts/unitInput';
import { UnitOutput } from './../puts/unitOutput';
import { Sets } from './../settings';


class Unit extends Block {
    name: string;


    divPrevCentreX: number;
    divPrevCentreY: number;
    divColor: string = null;


    constructor(id: number, outVec: object, name = 'Unit', color: string = null) {
        super(id, outVec, UnitInput, UnitOutput);
        this.name = name;
        this.addPutsByOutVec();

        this.divColor = color === null ? this.getRandomColor() : color;
        this.div.className += ' unit';
        this.styleDiv();
        this.div.onmousedown = this.mouseDownHandler;
        this.div.onmouseup = this.mouseUpHandler;
        this.div.onmousemove = this.mouseMoveHandler;
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

        for (let i = 0; i < outLen; i++) {
            this.addOutput();
        }

        let inpLen = Math.log2(this.outVec[0].length);
        for (let i = 0; i < inpLen; i++) {
            this.addInput();
        }
    };

    addPutDivs = (): void => {
        let puts = Object.keys(this.outs);
        let iter = 1;
        let dh = this.divHeight / (puts.length + 1)
        for (let i of puts) {
            let putDiv = this.outs[i].div;
            let left = this.divWidth + (Sets.unit.BORDER_WIDTH - Sets.put.SIZE) / 2;
            let top = dh * iter - Sets.put.SIZE / 2;
            this.outs[i].divCentreX = left;
            this.outs[i].divCentreY = top;
            putDiv.style.left = left + 'px';
            putDiv.style.top = top + 'px';
            this.div.appendChild(putDiv);
            iter++;
        }

        puts = Object.keys(this.inps);
        iter = 1;
        dh = this.divHeight / (puts.length + 1)
        for (let i of puts) {
            let putDiv = this.inps[i].div;
            let left = - (Sets.unit.BORDER_WIDTH + Sets.put.SIZE) / 2;
            let top = dh * iter - Sets.put.SIZE / 2;
            this.inps[i].divCentreX = left;
            this.inps[i].divCentreY = top;
            putDiv.style.left = left + 'px';
            putDiv.style.top = top + 'px';
            this.div.appendChild(putDiv);
            iter++;
        }
    }

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

    styleDiv = (): void => {
        let inpLen = Object.keys(this.inps).length;
        let outLen = Object.keys(this.outs).length;
        let maxPutLen = Math.max(inpLen, outLen);

        this.divWidth = Sets.unit.MIN_WIDTH;
        this.divHeight = Sets.unit.MIN_HEIGHT * maxPutLen;

        this.div.style.width = this.divWidth + 'px';
        this.div.style.height = this.divHeight + 'px';
        this.div.style.borderWidth = Sets.unit.BORDER_WIDTH + 'px';
        this.div.style.borderRadius = Sets.unit.BORDER_RADIUS + 'px';

        this.div.textContent = this.name;
        this.div.style.lineHeight = this.divHeight + 'px';
        this.div.style.backgroundColor = this.divColor;
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++)
            color += letters[Math.floor(Math.random() * 16)];
        return color;
    }

    mouseDownHandler = (e: MouseEvent): void => {
        this.startedClick = true;
    };

    mouseUpHandler = (e: MouseEvent): void => {
        this.startedClick = false;
    };

    mouseMoveHandler = (e: MouseEvent): void => {
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