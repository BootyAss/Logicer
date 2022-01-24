import { Put } from "./../puts/put";
import { IInput } from "./../puts/input";
import { IOutput } from "./../puts/output";
import { Sets } from './../settings';


class Block {
    outVec: object;
    id: number;
    inputType: IInput;
    outputType: IOutput;

    inps: object = {};
    outs: object = {};

    div: HTMLDivElement;
    divCentreX: number;
    divCentreY: number;
    divWidth: number = 0;
    divHeight: number = 0;

    startedClick: boolean = false;  // Mouse click was started on this DIV 
    clickedPut: Put = null;
    lines = {};

    constructor(id: number, outVec: object, inputType: IOutput, outputType: IOutput) {
        this.checkOutputVectors(outVec);

        this.id = id;
        this.outVec = outVec;

        // Fix this MF logic
        this.inputType = inputType;
        this.outputType = outputType;

        this.div = document.createElement('div');
        this.div.className = 'block';
    };

    addPut = (puts: object, putType: IInput | IOutput): number => {
        let id = this.generateId(puts);
        puts[id] = new putType(this, id);
        return id;
    };

    generateId = (obj: object): number => {
        let ids = Object.keys(obj).map(key => parseInt(key));
        let id = ids.length > 0 ? (Math.max(...ids) + 1) : 0;
        return id;
    };

    removeInput = (id: number | string): void => {
        this.removePut(this.inps, id);
    };

    removeOutput = (id: number | string): void => {
        this.removePut(this.outs, id);
    };

    removePut = (puts: object, id: number | string): void => {
        if (id in puts) {
            puts[id].removeSelf();
            delete puts[id];
        }
    };

    recalculateOutputVectors = (): void => {
        let len = Math.pow(2, Object.keys(this.inps).length);
        for (let outId of Object.keys(this.outVec))
            this.outVec[outId] = new Array(len).fill(false);
    };

    addOutputVector = (id: number): void => {
        let len = Math.pow(2, Object.keys(this.inps).length);
        this.outVec[id] = new Array(len).fill(false);
    };

    checkOutputVectors = (vec: object): void => {
        let outLen = Object.keys(vec).length;
        if (outLen === 0)
            throw '0 outputs in F Vector';

        let inputs: Array<Array<number>> = Object.values(vec);
        let lens = new Set(inputs.map(inp => inp.length));
        if (lens.size > 1)
            throw 'Different input sizes in F Vector';

        for (let inp of inputs) {
            let len = inp.length;
            if (len === 0 || len & (len - 1))
                throw '0/not power of 2 inputs in F Vector';
        }
    };

    checkAllInputs = (): void => { };

    getInput = (id: number): Put => {
        return this.getPut(id, this.inps)
    };

    getOutput = (id: number): Put => {
        return this.getPut(id, this.outs)
    };

    getPut = (id: number, puts: object): Put => {
        return puts[id];
    };

    getDiv = (): HTMLElement => {
        return this.div;
    };

    addInputDiv = (id: number, x: number, y: number): void => {
        let put = this.getInput(id);
        put.divCentreX = x;
        put.divCentreY = y;
        put.div.style.left = put.divCentreX + 'px';
        put.div.style.top = put.divCentreY + 'px';
        this.div.appendChild(put.div);
    };

    addOutputDiv = (id: number, x: number, y: number): void => {
        let put = this.getOutput(id);
        put.divCentreX = x;
        put.divCentreY = y;
        put.div.style.left = put.divCentreX + 'px';
        put.div.style.top = put.divCentreY + 'px';
        this.div.appendChild(put.div);
    };

    mouseDownHandler = (e: MouseEvent): void => {
        this.startedClick = true;
    };

    mouseUpHandler = (e: MouseEvent): void => {
        this.startedClick = false;
    };

    mouseMoveHandler = (e: MouseEvent): void => {
    };

};


export { Block };