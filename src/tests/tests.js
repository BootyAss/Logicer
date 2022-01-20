const Unit = require('./blocks/unit');
const testUnits = require('./testUnits');


var Tests = {
    neww: (scheme) => {
        let unit1 = new Unit(0, testUnits.notUnit);
        let unit2 = new Unit(1, testUnits.notUnit);
        let SI0 = scheme.getInput(0);
        let SO0 = scheme.getOutput(0);

        let U1I = unit1.getInput(0);
        let U2I = unit2.getInput(0);
        let U1O = unit1.getOutput(0);
        let U2O = unit2.getOutput(0);

        SI0.connect(U1I);
        U1O.connect(U2I);
        U2O.connect(SO0);

        unit1.debug();
        unit2.debug();
        scheme.debug();
    },

    saveNandUnit: (scheme) => {
        let unitAdd = new Unit(0, testUnits.andUnit);
        let unitNot = new Unit(1, testUnits.notUnit);

        scheme.addInput();

        let SI0 = scheme.getInput(0);
        let SI1 = scheme.getInput(1);
        let SO0 = scheme.getOutput(0);

        let U0I0 = unitAdd.getInput(0);
        let U0I1 = unitAdd.getInput(1);
        let U0O0 = unitAdd.getOutput(0);


        let U1I0 = unitNot.getInput(0);
        let U1O0 = unitNot.getOutput(0);

        SI0.connect(U0I0);
        SI1.connect(U0I1);
        U0O0.connect(U1I0);
        U1O0.connect(SO0);

        unitAdd.debug();
        unitNot.debug();
        scheme.debug();

        let nandUnit = scheme.saveAsUnit(2);
        let nandI0 = nandUnit.getInput(0);
        let nandI1 = nandUnit.getInput(1);
        let nandO = nandUnit.getOutput(0);

        SI0.connect(nandI0)
        SI1.connect(nandI1)
        nandO.connect(SO0)

        nandUnit.debug();
        unitAdd.debug();
        unitNot.debug();
        scheme.debug();
    },

    // S -> NOT + andOrNandNor -> S
    test1: (scheme) => {
        let unit1 = new Unit(0, testUnits.andOrNandNorUnit);
        let unit2 = new Unit(1, testUnits.notUnit);

        scheme.addInput();
        scheme.addOutput();
        scheme.addOutput();
        scheme.addOutput();

        let SI0 = scheme.getInput(0);
        let SI1 = scheme.getInput(1);

        let SO0 = scheme.getOutput(0);
        let SO1 = scheme.getOutput(1);
        let SO2 = scheme.getOutput(2);
        let SO3 = scheme.getOutput(3);

        let UI0 = unit1.getInput(0);
        let UI1 = unit1.getInput(1);

        let U2I = unit2.getInput(0);

        let UO0 = unit1.getOutput(0);
        let UO1 = unit1.getOutput(1);
        let UO2 = unit1.getOutput(2);
        let UO3 = unit1.getOutput(3);
        let U2O = unit2.getOutput(0);

        scheme.debug();
        unit1.debug();
        unit2.debug();

        SI0.connect(U2I);
        U2O.connect(UI0);
        SI1.connect(UI1);
        UO0.connect(SO0);
        UO1.connect(SO1);
        UO2.connect(SO2);
        UO3.connect(SO3);

        console.log(' ====== ')
        scheme.debug();
        unit1.debug();
        unit2.debug();

        SI0.connect(UI0);

        console.log(' ====== ')
        scheme.debug();
        unit1.debug();
        unit2.debug();
    },

    // S -> andOrNandNor -> S
    test2: (scheme) => {
        let unit = new Unit(0, testUnits.notUnit);
        let SI0 = scheme.getInput(0);
        let SO0 = scheme.getOutput(0);

        let UI0 = unit.getInput(0);
        let UO0 = unit.getOutput(0);

        scheme.debug();
        unit.debug();


        SI0.connect(UI0);
        UO0.connect(SO0);

        console.log(' ====== ');
        scheme.debug();
        unit.debug();
    }
}

module.exports = Tests;