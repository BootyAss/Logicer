export class Block {
    inps = {};
    outs = {};
    outVec = {};
    id = 0;

    inputType = null;
    outputType = null;

    div = null;
    constructor(id, outVec, inputType, outputType) {
        this.checkOutputVectors(outVec);

        this.id = id;
        this.outVec = outVec;

        // Fix this MF logic
        this.inputType = inputType;
        this.outputType = outputType;

        this.div = document.createElement('div');
    }


    addPut = (puts, putType) => {
        let id = this.generateId(puts);
        puts[id] = new putType(this, id);
        return id;
    }

    generateId = (obj) => {
        let ids = Object.keys(obj);
        let id = ids.length > 0 ? (Math.max(...ids) + 1) : 0;
        return id;
    }

    removeInput = (id) => {
        this.removePut(this.inps, id);
    }

    removeOutput = (id) => {
        this.removePut(this.outs, id);
    }

    removePut = (puts, id) => {
        if (id in puts) {
            puts[id].removeSelf();
            delete puts[id];
        }
    }


    recalculateOutputVectors = () => {
        let len = Math.pow(2, Object.keys(this.inps).length);
        for (let outId of Object.keys(this.outVec))
            this.outVec[outId] = new Array(len).fill(false);
    }

    addOutputVector = (id) => {
        let len = Math.pow(2, Object.keys(this.inps).length);
        this.outVec[id] = new Array(len).fill(false);
    }

    checkOutputVectors = (vec) => {
        let outLen = Object.keys(vec).length;
        if (outLen === 0)
            throw '0 outputs in F Vector';

        let inputs = Object.values(vec);
        let lens = new Set(inputs.map(inp => inp.length))
        if (lens.size > 1)
            throw 'Different input sizes in F Vector';

        for (let inp of inputs) {
            let len = inp.length;
            if (len === 0 || len & (len - 1))
                throw '0/not power of 2 inputs in F Vector';
        }
    }

    getInput = (id) => {
        return this.getPut(id, this.inps)
    }

    getOutput = (id) => {
        return this.getPut(id, this.outs)
    }

    getPut = (id, puts) => {
        return puts[id];
    }

    getDiv = () => {
        return this.div;
    }
}