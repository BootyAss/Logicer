// const Block = require('./block');
// const Unit = require('./unit');
// const SchemeInput = require('./../puts/schemeInput');
// const SchemeOutput = require('./../puts/schemeOutput');
import { Block } from './block.js';
import { Unit } from './unit.js';
import { SchemeInput } from './../puts/schemeInput.js';
import { SchemeOutput } from './../puts/schemeOutput.js';
import { Sets } from './../settings.js';
class Scheme extends Block {
    constructor(id, outVec = { 0: [false, false] }) {
        super(id, outVec, SchemeInput, SchemeOutput);
        this.units = {};
        this.unitToAdd = null;
        this.unitToMove = null;
        this.zIndexMax = 0;
        this.addInput = () => {
            let id = this.addPut(this.inps, this.inputType);
            this.recalculateOutputVectors();
            return id;
        };
        this.addOutput = () => {
            let id = this.addPut(this.outs, this.outputType);
            this.addOutputVector(id);
            return id;
        };
        this.flipInput = (id) => {
            let input = this.inps[id];
            if (!input)
                throw 'no input for ' + id;
            input.flip();
        };
        this.checkAllInputs = () => {
            for (let i of Object.keys(this.outs))
                if (this.outs[i].connection)
                    this.outs[i].setState(this.outs[i].connection.state);
        };
        this.setInputs = (binVal) => {
            let iter = 0;
            for (let i of Object.keys(this.inps)) {
                let bin = Boolean(parseInt(binVal[iter]));
                this.inps[i].setState(bin);
                iter++;
            }
        };
        this.addUnit = (inputVal, name) => {
            let color = null;
            if (inputVal instanceof Unit) {
                name = inputVal.name;
                color = inputVal.divColor;
                inputVal = inputVal.outVec;
            }
            let id = this.generateId(this.units);
            let unit = new Unit(id, inputVal, name, color);
            if (unit)
                this.units[id] = unit;
            return id;
        };
        this.getUnit = (id) => {
            return this.units[id];
        };
        this.saveAsUnit = (name) => {
            let outputVectors = {};
            let vectorLen = Math.pow(2, Object.keys(this.inps).length);
            for (let i of Object.keys(this.outs))
                outputVectors[i] = new Array(vectorLen).fill(0);
            let iter = 0;
            for (let i = 0; i < vectorLen; i++) {
                let binVal = iter.toString(2);
                this.setInputs(binVal);
                for (let j of Object.keys(this.outs))
                    outputVectors[j][i] = this.outs[j].state;
                iter++;
            }
            return new Unit(null, outputVectors, name);
        };
        this.removeUnit = (id) => {
            if (id in this.units) {
                this.units[id].removeSelf();
                delete this.units[id];
            }
        };
        this.clear = () => {
            for (let i of Object.keys(this.inps))
                this.removeInput(i);
            for (let i of Object.keys(this.outs))
                this.removeOutput(i);
            for (let i of Object.keys(this.units))
                this.removeUnit(i);
            this.addOutput();
            this.addInput();
        };
        this.styleDiv = () => {
            this.div.style.width = Sets.scheme.WIDTH + 'px';
            this.div.style.height = Sets.scheme.HEIGHT + 'px';
            this.div.style.borderWidth = Sets.scheme.BORDER_WIDTH + 'px';
            this.div.style.borderRadius = Sets.scheme.BORDER_RADIUS + 'px';
            this.div.id = 'scheme ' + this.id;
        };
        this.checkIfOnUnit = (x, y, offset = 0) => {
            for (let i of Object.keys(this.units)) {
                // Unit Div borders
                let left = this.units[i].divCentreX - this.units[i].divWidth / 2;
                let right = this.units[i].divCentreX + this.units[i].divWidth / 2 + Sets.unit.BORDER_WIDTH * 2;
                let top = this.units[i].divCentreY - this.units[i].divHeight / 2;
                let bot = this.units[i].divCentreY + this.units[i].divHeight / 2 + Sets.unit.BORDER_WIDTH * 2;
                let byWidth = x > left - offset && x < right + offset;
                let byHeight = y > top - offset && y < bot + offset;
                if (byWidth && byHeight)
                    return i;
            }
            return null;
        };
        this.checkIfOutOfScheme = (unit) => {
            let left = unit.divCentreX;
            let right = unit.divCentreX + unit.divWidth + Sets.unit.BORDER_WIDTH * 2;
            let top = unit.divCentreY;
            let bot = unit.divCentreY + unit.divHeight + Sets.unit.BORDER_WIDTH * 2;
            let outByWidth = left < Sets.container.LEFT ||
                right > Sets.container.LEFT + Sets.scheme.WIDTH + Sets.scheme.BORDER_WIDTH;
            let outByHeight = top < Sets.container.TOP + Sets.scheme.BORDER_WIDTH ||
                bot > Sets.container.TOP + Sets.scheme.HEIGHT + Sets.scheme.BORDER_WIDTH * 2;
            return outByWidth || outByHeight;
        };
        this.checkIfOnBorder = (x, y) => {
            let left = x < Sets.scheme.BORDER_WIDTH / 2;
            let right = x > Sets.scheme.WIDTH - Sets.scheme.BORDER_WIDTH / 2 && x < Sets.scheme.WIDTH + Sets.scheme.BORDER_WIDTH;
            let top = y < Sets.scheme.BORDER_WIDTH / 2;
            let bot = y > Sets.scheme.HEIGHT - Sets.scheme.BORDER_WIDTH / 2 && y < Sets.scheme.HEIGHT + Sets.scheme.BORDER_WIDTH;
            return left || right || top || bot;
        };
        this.mouseDownHandler = (e) => {
            this.startedCLick = true;
            let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
            let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;
            let unitId = this.checkIfOnUnit(cursorX, cursorY, 5);
            if (unitId) {
                this.unitToMove = this.getUnit(unitId);
                this.unitToMove.divPrevCentreX = this.unitToMove.divCentreX;
                this.unitToMove.divPrevCentreY = this.unitToMove.divCentreY;
            }
        };
        this.mouseUpHandler = (e) => {
            if (this.unitToMove !== null) {
                if (this.checkIfOutOfScheme(this.unitToMove)) {
                    this.unitToMove.divCentreX = this.unitToMove.divPrevCentreX;
                    this.unitToMove.divCentreY = this.unitToMove.divPrevCentreY;
                    this.unitToMove.div.style.left = (this.unitToMove.divCentreX - this.unitToMove.divWidth / 2) + 'px';
                    this.unitToMove.div.style.top = (this.unitToMove.divCentreY - this.unitToMove.divHeight / 2) + 'px';
                }
                this.unitToMove = null;
                return;
            }
            if (!this.startedCLick)
                return;
            let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
            let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;
            // Create Scheme Put
            if (this.checkIfOnBorder(cursorX, cursorY))
                return;
            // Create Unit
            let offset = 50;
            if (this.checkIfOnUnit(cursorX, cursorY, offset))
                return;
            let id = this.addUnit(this.unitToAdd);
            let newUnit = this.getUnit(id);
            newUnit.divCentreX = cursorX;
            newUnit.divCentreY = cursorY;
            newUnit.div.style.left = (cursorX - newUnit.divWidth / 2) + 'px';
            newUnit.div.style.top = (cursorY - newUnit.divHeight / 2) + 'px';
            newUnit.div.id = 'unit ' + id;
            newUnit.addPutDivs();
            this.div.appendChild(newUnit.div);
            this.startedCLick = false;
        };
        this.mouseMoveHandler = (e) => {
            if (!this.startedCLick || this.unitToMove === null)
                return;
            let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
            let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;
            this.unitToMove.divCentreX = cursorX;
            this.unitToMove.divCentreY = cursorY;
            this.unitToMove.div.style.left = (cursorX - this.unitToMove.divWidth / 2) + 'px';
            this.unitToMove.div.style.top = (cursorY - this.unitToMove.divHeight / 2) + 'px';
            this.zIndexMax++;
            this.unitToMove.div.style.zIndex = this.zIndexMax.toString();
        };
        this.debug = () => {
            console.log('Scheme:\n\tinputs:');
            for (let put of Object.values(this.inps)) {
                console.log(put.debug());
            }
            console.log('\toutputs:');
            for (let put of Object.values(this.outs)) {
                console.log(put.debug());
            }
            console.log('\tUnits:');
            for (let unit of Object.values(this.units)) {
                unit.debug();
            }
        };
        this.addOutput();
        this.addInput();
        this.div.className += ' scheme';
        this.div.onmousedown = this.mouseDownHandler;
        this.div.onmouseup = this.mouseUpHandler;
        this.div.onmousemove = this.mouseMoveHandler;
        this.styleDiv();
    }
    ;
}
;
export { Scheme };
