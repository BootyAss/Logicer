const Scheme = require('./blocks/scheme');
const Unit = require('./blocks/unit');

let addNandUnit = {
    0: [false, false, false, true],
    1: [true, true, true, false]
};
let scheme = new Scheme(0);
let unit = new Unit(0, addNandUnit);

scheme.addInput();
scheme.addOutput();

let SI0 = scheme.getInput(0);
let SI1 = scheme.getInput(1);
let SO0 = scheme.getOutput(0);
let SO1 = scheme.getOutput(1);

let UI0 = unit.getInput(0);
let UI1 = unit.getInput(1);
let UO0 = unit.getOutput(0);
let UO1 = unit.getOutput(1);

scheme.debug();
unit.debug();


SI0.connect(UI0);
SI1.connect(UI1);
UO0.connect(SO0);
UO1.connect(SO1);

console.log(' ====== ')
scheme.debug();
unit.debug();