const Scheme = require('./blocks/scheme');
const Unit = require('./blocks/unit');
const Tests = require('./tests');


let scheme = new Scheme(0);


// // S -> NOT + andOrNandNor -> S
// Tests.test1(scheme);
// // S -> andOrNandNor -> S
// Tests.test2(scheme);
Tests.saveNandUnit(scheme);
// Tests.neww(scheme);
console.log()