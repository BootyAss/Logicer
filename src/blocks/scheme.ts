// const Block = require('./block');
// const Unit = require('./unit');
// const SchemeInput = require('./../puts/schemeInput');
// const SchemeOutput = require('./../puts/schemeOutput');

import { Block } from './block';
import { Unit } from './unit';
import { Put } from './../puts/put';
import { SchemeInput } from './../puts/schemeInput';
import { SchemeOutput } from './../puts/schemeOutput';
import { Sets } from './../settings';


class Scheme extends Block {
    units: object = {};
    unitToAdd: Unit = null;
    unitToMove: Unit = null;
    putToMove = null;
    zIndexMax: number = 0;

    svg: SVGElement = null;
    lineId = 0;
    clickedUnitPut: Put = null;

    constructor(id: number, svg: SVGElement, outVec = { 0: [false, false] }) {
        super(id, outVec, SchemeInput, SchemeOutput);

        let putId = this.addInput();
        let x = -Sets.scheme.BORDER_WIDTH / 2 - Sets.put.SIZE / 2;
        this.addInputDiv(putId, x, Sets.scheme.HEIGHT / 2);

        putId = this.addOutput();
        x = Sets.scheme.WIDTH + (Sets.scheme.BORDER_WIDTH - Sets.put.SIZE) / 2;
        this.addOutputDiv(putId, x, Sets.scheme.HEIGHT / 2);

        this.svg = svg;
        this.div.appendChild(this.svg)

        this.div.className += ' scheme';
        this.div.onmousedown = this.mouseDownHandler;
        this.div.onmouseup = this.mouseUpHandler;
        this.div.onmousemove = this.mouseMoveHandler;
        this.styleDiv();
    };

    addInput = (): number => {
        let id = this.addPut(this.inps, this.inputType);
        this.recalculateOutputVectors();
        return id;
    };

    addOutput = (): number => {
        let id = this.addPut(this.outs, this.outputType);
        this.addOutputVector(id);
        return id;
    };

    flipInput = (id: number | string): void => {
        let input: SchemeInput = this.inps[id];
        if (!input)
            throw 'no input for ' + id;
        input.flip();
    };

    checkAllInputs = (): void => {
        for (let i of Object.keys(this.outs))
            if (this.outs[i].connection)
                this.outs[i].setState(this.outs[i].connection.state);
    };


    setInputs = (binVal: string): void => {
        let iter = 0;
        for (let i of Object.keys(this.inps)) {
            let bin = Boolean(parseInt(binVal[iter]));
            this.inps[i].setState(bin);
            iter++;
        }
    };

    addUnit = (inputVal: Unit | object, name?: string): number => {
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

    getUnit = (id: number | string): Unit => {
        return this.units[id];
    };

    saveAsUnit = (name?: string): Unit => {
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

    removeUnit = (id: number | string): void => {
        if (id in this.units) {
            this.units[id].removeSelf();
            delete this.units[id];
        }
    };

    clear = (): void => {
        for (let i of Object.keys(this.inps))
            this.removeInput(i);

        for (let i of Object.keys(this.outs))
            this.removeOutput(i);

        for (let i of Object.keys(this.units))
            this.removeUnit(i);

        this.addOutput();
        this.addInput();
    };

    styleDiv = () => {
        this.div.style.width = Sets.scheme.WIDTH + 'px';
        this.div.style.height = Sets.scheme.HEIGHT + 'px';
        this.div.style.borderWidth = Sets.scheme.BORDER_WIDTH + 'px';
        this.div.style.borderRadius = Sets.scheme.BORDER_RADIUS + 'px';
        this.div.id = 'scheme ' + this.id;
    };



    checkIfOnUnit = (unit: Unit, x: number, y: number, offsetX: number = 0, offsetY: number = 0): string => {
        for (let i of Object.keys(this.units)) {
            if (unit !== null && i == unit.id.toString()) {
                continue;
            }

            // Unit Div borders
            let left = this.units[i].divCentreX - this.units[i].divWidth / 2;
            let right = this.units[i].divCentreX + this.units[i].divWidth / 2 + Sets.unit.BORDER_WIDTH * 2;
            let top = this.units[i].divCentreY - this.units[i].divHeight / 2;
            let bot = this.units[i].divCentreY + this.units[i].divHeight / 2 + Sets.unit.BORDER_WIDTH * 2;

            let byWidth = x > left - offsetX && x < right + offsetX;
            let byHeight = y > top - offsetY && y < bot + offsetY;

            if (byWidth && byHeight)
                return i;
        }
        return null;
    };

    checkIfOutOfScheme = (unit: Unit, offsetX: number, offsetY: number): boolean => {
        let left = unit.divCentreX - unit.divWidth / 2 - Sets.put.SIZE / 2;
        let right = unit.divCentreX + unit.divWidth / 2 + Sets.scheme.BORDER_WIDTH + Sets.unit.BORDER_WIDTH * 2 + Sets.put.SIZE / 2;
        let top = unit.divCentreY - unit.divHeight / 2;
        let bot = unit.divCentreY + unit.divHeight / 2 + Sets.scheme.BORDER_WIDTH + Sets.unit.BORDER_WIDTH * 2;

        let outByWidth = left < Sets.unit.BORDER_WIDTH - offsetX ||
            right > Sets.scheme.WIDTH + Sets.unit.BORDER_WIDTH * 2 + offsetX;
        let outByHeight = top < Sets.unit.BORDER_WIDTH - offsetY ||
            bot > Sets.scheme.HEIGHT + Sets.unit.BORDER_WIDTH * 2 + offsetY;
        return outByWidth || outByHeight;
    };

    checkIfOnPut = (putId: string | number, puts: object, y: number, offset: number = 0): string => {
        let side = Sets.put.SIZE / 2;
        for (let i of Object.keys(puts)) {
            if (i == putId) {
                continue;
            }

            if (Math.abs(y - puts[i].divCentreY) < 2 * side + offset)
                return i;
        }
        return null;
    };

    checkIfOnBorder = (x: number, y: number): Array<boolean> => {
        let left = x < Sets.scheme.BORDER_WIDTH / 2;
        let right = x > Sets.scheme.WIDTH - Sets.scheme.BORDER_WIDTH / 2 && x < Sets.scheme.WIDTH + Sets.scheme.BORDER_WIDTH;
        let top = y < Sets.scheme.BORDER_WIDTH / 2;
        let bot = y > Sets.scheme.HEIGHT - Sets.scheme.BORDER_WIDTH / 2 && y < Sets.scheme.HEIGHT + Sets.scheme.BORDER_WIDTH;
        return [left, right, top, bot];
    }

    createLine = (id: number, x1: number, y1: number, x2: number, y2: number): SVGElement => {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute('id', 'line ' + id);
        line.setAttribute('class', 'line false');
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', '4');
        return line;
    }

    mouseDownHandler = (e: MouseEvent): void => {
        if (e.button !== 0)
            return;

        this.startedClick = true;

        let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
        let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;

        if (this.clickedPut !== null) {
            this.clickedUnitPut = this.clickedPut;
            // let x = this.clickedUnitPut.divCentreX + Sets.put.SIZE / 2;
            // let y = this.clickedUnitPut.divCentreY + Sets.put.SIZE / 2;

            // let line = this.createLine(this.lineId, x, y);
            // this.svg.append(line);
            return;
        }

        // If clicked on Unit / Unit's Put
        let unitId = null;
        for (let i of Object.keys(this.units)) {
            if (this.units[i].clickedPut !== null) {
                this.clickedUnitPut = this.units[i].clickedPut;
                // let x = this.clickedUnitPut.divCentreX + Sets.put.SIZE / 2 + Sets.unit.BORDER_WIDTH;
                // let y = this.clickedUnitPut.divCentreY + Sets.put.SIZE / 2 + Sets.unit.BORDER_WIDTH;
                // x += this.clickedUnitPut.parent.divCentreX - this.clickedUnitPut.parent.divWidth / 2;
                // y += this.clickedUnitPut.parent.divCentreY - this.clickedUnitPut.parent.divHeight / 2;

                // let line = this.createLine(this.lineId, x, y);
                // this.svg.append(line);
                return;
            }
            if (this.units[i].startedClick)
                unitId = i;
        }

        if (unitId === null) {
            return;
        }

        let unit = this.getUnit(unitId);
        this.unitToMove = unit;
        this.unitToMove.divPrevCentreX = this.unitToMove.divCentreX;
        this.unitToMove.divPrevCentreY = this.unitToMove.divCentreY;

    };

    mouseUpHandler = (e: MouseEvent): void => {
        // If click started not inside scheme
        if (!this.startedClick)
            return;

        let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
        let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;


        // Were dragging put
        if (this.clickedUnitPut !== null) {
            let cons: Array<Put> = [];
            cons.push(this.clickedUnitPut);

            if (this.clickedPut !== null && this.clickedPut !== this.clickedUnitPut)
                cons.push(this.clickedPut);

            for (let i of Object.keys(this.units)) {
                let unitsPut = this.units[i].clickedPut;
                if (unitsPut !== null && unitsPut !== this.clickedUnitPut) {
                    cons.push(unitsPut);
                }
            }
            console.log(cons)
            for (let con of cons) {
                con.parent.clickedPut = null;
                con.parent.startedClick = false;
            }

            if (cons.length === 2) {
                let second = cons[1];
                this.clickedUnitPut.connect(second);
                let x1 = this.clickedUnitPut.divCentreX + Sets.put.SIZE / 2;
                let y1 = this.clickedUnitPut.divCentreY + Sets.put.SIZE / 2;
                if (this.clickedUnitPut.parent !== this) {
                    x1 += Sets.unit.BORDER_WIDTH + this.clickedUnitPut.parent.divCentreX - this.clickedUnitPut.parent.divWidth / 2;
                    y1 += Sets.unit.BORDER_WIDTH + this.clickedUnitPut.parent.divCentreY - this.clickedUnitPut.parent.divHeight / 2;
                }
                let x2 = cons[1].divCentreX + Sets.put.SIZE / 2;
                let y2 = cons[1].divCentreY + Sets.put.SIZE / 2;
                if (cons[1].parent !== this) {
                    x2 += Sets.unit.BORDER_WIDTH + cons[1].parent.divCentreX - cons[1].parent.divWidth / 2;
                    y2 += Sets.unit.BORDER_WIDTH + cons[1].parent.divCentreY - cons[1].parent.divHeight / 2;
                }

                let line = this.createLine(this.lineId, x1, y1, x2, y2);
                this.svg.append(line);
            }

            this.clickedUnitPut = null;
            this.startedClick = false;
            return;
        }

        // If was moving Unit
        if (this.unitToMove !== null) {
            // If moved from scheme
            if (this.checkIfOutOfScheme(this.unitToMove, 0, 0)) {
                this.unitToMove.divCentreX = this.unitToMove.divPrevCentreX;
                this.unitToMove.divCentreY = this.unitToMove.divPrevCentreY;
                this.unitToMove.div.style.left = (this.unitToMove.divCentreX - this.unitToMove.divWidth / 2) + 'px';
                this.unitToMove.div.style.top = (this.unitToMove.divCentreY - this.unitToMove.divHeight / 2) + 'px';
            }
            // Stop moving
            this.unitToMove = null;
            this.startedClick = false;
            return;
        }

        let border = this.checkIfOnBorder(cursorX, cursorY);
        if (border.some(v => v === true)) {
            if (border[2] || border[3]) {
                this.startedClick = false;
                return;
            }

            let id = null;
            let puts = null;
            let divCentreX = 0;

            if (border[0]) {
                id = this.addInput();
                puts = this.inps;
                divCentreX = -(Sets.put.SIZE + Sets.scheme.BORDER_WIDTH) / 2;
            } else if (border[1]) {
                id = this.addOutput();
                puts = this.outs;
                divCentreX = Sets.scheme.WIDTH + (Sets.scheme.BORDER_WIDTH - Sets.put.SIZE) / 2;
            }


            if (id !== null) {
                let put = this.getPut(id, puts);
                put.divCentreX = divCentreX;
                put.divCentreY = cursorY - Sets.put.SIZE / 2;
                if (this.checkIfOnPut(put.id, puts, put.divCentreY, 5) !== null) {
                    this.removePut(puts, put.id);
                    this.startedClick = false;
                    return;
                }

                put.div.style.left = divCentreX + 'px';
                put.div.style.top = put.divCentreY + 'px';
                this.div.appendChild(put.div);
            }
        }
        else {
            // Create Unit

            let id = this.addUnit(this.unitToAdd);
            let newUnit = this.getUnit(id);

            newUnit.divCentreX = cursorX;
            newUnit.divCentreY = cursorY;
            let offsetX = newUnit.divWidth / 2 + Sets.put.SIZE + 5;
            let offsetY = newUnit.divHeight / 2 + 5;
            let onTopOfUnit = this.checkIfOnUnit(
                newUnit, newUnit.divCentreX, newUnit.divCentreY, offsetX, offsetY
            );

            let outsideOfBorder = this.checkIfOutOfScheme(newUnit, 0, 0);
            if (onTopOfUnit !== null || outsideOfBorder) {
                this.removeUnit(id);
                this.startedClick = false;
                return;
            }

            newUnit.div.style.left = (cursorX - newUnit.divWidth / 2) + 'px';
            newUnit.div.style.top = (cursorY - newUnit.divHeight / 2) + 'px';
            newUnit.div.id = 'unit ' + newUnit.id;
            this.zIndexMax++;
            newUnit.div.style.zIndex = this.zIndexMax + 'px';

            newUnit.addPutDivs();
            this.div.appendChild(newUnit.div);
        }
        this.startedClick = false;
    };

    mouseMoveHandler = (e: MouseEvent): void => {
        if (!this.startedClick)
            return;

        let cursorX = e.pageX - Sets.container.LEFT - Sets.scheme.BORDER_WIDTH;
        let cursorY = e.pageY - Sets.container.TOP - Sets.scheme.BORDER_WIDTH;

        if (this.clickedUnitPut !== null) {
            // let line = document.getElementById('line ' + this.lineId)
            // line.setAttribute('x2', cursorX.toString());
            // line.setAttribute('y2', cursorY.toString());
        }

        if (this.unitToMove !== null) {
            this.unitToMove.divCentreX = cursorX;
            this.unitToMove.divCentreY = cursorY;
            this.unitToMove.div.style.left = (cursorX - this.unitToMove.divWidth / 2) + 'px';
            this.unitToMove.div.style.top = (cursorY - this.unitToMove.divHeight / 2) + 'px';
            this.zIndexMax++;
            this.unitToMove.div.style.zIndex = this.zIndexMax.toString();
        }
    };

    debug = (): void => {
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
    };
};


export { Scheme };