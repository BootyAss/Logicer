module.exports = class Block {
    inps = {};
    outs = {};
    outVec = {};
    id = 0;

    inputType = null;
    outputType = null;

    constructor(id, outVec, inputType, outputType) {
        this.checkOutputVectors(outVec);

        this.id = id;
        this.outVec = outVec;

        // Fix this MF logic
        this.inputType = inputType;
        this.outputType = outputType;
    }

    get name() { return this.constructor.name; }

    addPut = (puts, putType) => {
        let id = this.generatePutId(puts);
        puts[id] = new putType(this, id);
        return id;
    }

    generatePutId = (puts) => {
        let ids = Object.keys(puts);
        let id = ids.length > 0 ? (Math.max(...ids) + 1) : 0;
        return id;
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



    debug = () => {
        console.log('\n' + this.constructor.name + ':')
        console.log('\tinputs:')
        for (let put of Object.values(this.inps)) {
            console.log(put.debug());
        }
        console.log('\toutputs:')
        for (let put of Object.values(this.outs)) {
            console.log(put.debug());
        }
    }
}