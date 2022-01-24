class Block {
    constructor(id, outVec, inputType, outputType) {
        this.inps = {};
        this.outs = {};
        this.divWidth = 0;
        this.divHeight = 0;
        this.startedClick = false; // Mouse click was started on this DIV 
        this.clickedPut = null;
        this.lines = {};
        this.addPut = (puts, putType) => {
            let id = this.generateId(puts);
            puts[id] = new putType(this, id);
            return id;
        };
        this.generateId = (obj) => {
            let ids = Object.keys(obj).map(key => parseInt(key));
            let id = ids.length > 0 ? (Math.max(...ids) + 1) : 0;
            return id;
        };
        this.removeInput = (id) => {
            this.removePut(this.inps, id);
        };
        this.removeOutput = (id) => {
            this.removePut(this.outs, id);
        };
        this.removePut = (puts, id) => {
            if (id in puts) {
                puts[id].removeSelf();
                delete puts[id];
            }
        };
        this.recalculateOutputVectors = () => {
            let len = Math.pow(2, Object.keys(this.inps).length);
            for (let outId of Object.keys(this.outVec))
                this.outVec[outId] = new Array(len).fill(false);
        };
        this.addOutputVector = (id) => {
            let len = Math.pow(2, Object.keys(this.inps).length);
            this.outVec[id] = new Array(len).fill(false);
        };
        this.checkOutputVectors = (vec) => {
            let outLen = Object.keys(vec).length;
            if (outLen === 0)
                throw '0 outputs in F Vector';
            let inputs = Object.values(vec);
            let lens = new Set(inputs.map(inp => inp.length));
            if (lens.size > 1)
                throw 'Different input sizes in F Vector';
            for (let inp of inputs) {
                let len = inp.length;
                if (len === 0 || len & (len - 1))
                    throw '0/not power of 2 inputs in F Vector';
            }
        };
        this.checkAllInputs = () => { };
        this.getInput = (id) => {
            return this.getPut(id, this.inps);
        };
        this.getOutput = (id) => {
            return this.getPut(id, this.outs);
        };
        this.getPut = (id, puts) => {
            return puts[id];
        };
        this.getDiv = () => {
            return this.div;
        };
        this.addInputDiv = (id, x, y) => {
            let put = this.getInput(id);
            put.divCentreX = x;
            put.divCentreY = y;
            put.div.style.left = put.divCentreX + 'px';
            put.div.style.top = put.divCentreY + 'px';
            this.div.appendChild(put.div);
        };
        this.addOutputDiv = (id, x, y) => {
            let put = this.getOutput(id);
            put.divCentreX = x;
            put.divCentreY = y;
            put.div.style.left = put.divCentreX + 'px';
            put.div.style.top = put.divCentreY + 'px';
            this.div.appendChild(put.div);
        };
        this.mouseDownHandler = (e) => {
            this.startedClick = true;
        };
        this.mouseUpHandler = (e) => {
            this.startedClick = false;
        };
        this.mouseMoveHandler = (e) => {
        };
        this.checkOutputVectors(outVec);
        this.id = id;
        this.outVec = outVec;
        // Fix this MF logic
        this.inputType = inputType;
        this.outputType = outputType;
        this.div = document.createElement('div');
        this.div.className = 'block';
    }
    ;
}
;
export { Block };
