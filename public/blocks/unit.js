// const Block = require('./block');
// const UnitInput = require('./../puts/unitInput');
// const UnitOutput = require('./../puts/unitOutput');
import { Block } from './block.js';
import { UnitInput } from './../puts/unitInput.js';
import { UnitOutput } from './../puts/unitOutput.js';
import { Sets } from './../settings.js';
class Unit extends Block {
    constructor(id, outVec, name = 'Unit', color = null) {
        super(id, outVec, UnitInput, UnitOutput);
        this.divWidth = 0;
        this.divHeight = 0;
        this.divColor = null;
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
            for (let i = 0; i < outLen; i++) {
                this.addOutput();
            }
            let inpLen = Math.log2(this.outVec[0].length);
            for (let i = 0; i < inpLen; i++) {
                this.addInput();
            }
        };
        this.addPutDivs = () => {
            let puts = Object.keys(this.outs);
            let iter = 1;
            let dh = this.divHeight / (puts.length + 1);
            for (let i of puts) {
                let putDiv = this.outs[i].div;
                this.div.appendChild(putDiv);
                putDiv.style.width = Sets.put.SIZE + 'px';
                putDiv.style.height = Sets.put.SIZE + 'px';
                let left = this.divWidth;
                let top = dh * iter;
                putDiv.style.left = left + (Sets.unit.BORDER_WIDTH - Sets.put.SIZE) / 2 + 'px';
                putDiv.style.top = top - Sets.put.SIZE / 2 + 'px';
                iter++;
            }
            puts = Object.keys(this.inps);
            iter = 1;
            dh = this.divHeight / (puts.length + 1);
            for (let i of puts) {
                let putDiv = this.inps[i].div;
                this.div.appendChild(putDiv);
                putDiv.style.width = Sets.put.SIZE + 'px';
                putDiv.style.height = Sets.put.SIZE + 'px';
                let left = 0;
                let top = dh * iter;
                putDiv.style.left = left - (Sets.unit.BORDER_WIDTH + Sets.put.SIZE) / 2 + 'px';
                putDiv.style.top = top - Sets.put.SIZE / 2 + 'px';
                iter++;
            }
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
        this.styleDiv = () => {
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
        };
        this.getRandomColor = () => {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++)
                color += letters[Math.floor(Math.random() * 16)];
            return color;
        };
        this.mouseDownHandler = (e) => {
            this.startedCLick = true;
        };
        this.mouseUpHandler = (e) => {
            this.startedCLick = false;
        };
        this.mouseMoveHandler = (e) => {
            // this.startedCLick = false;
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
        this.divColor = color === null ? this.getRandomColor() : color;
        this.div.className += ' unit';
        this.styleDiv();
        this.div.onmousedown = this.mouseDownHandler;
        this.div.onmouseup = this.mouseUpHandler;
        this.div.onmousemove = this.mouseMoveHandler;
    }
    ;
}
;
export { Unit };
