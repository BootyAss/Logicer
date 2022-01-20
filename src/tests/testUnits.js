let andUnit = {
    0: [false, false, false, true], // 0 0 0 1
};

let andNandUnit = {
    0: [false, false, false, true],
    1: [true, true, true, false]
};

let andOrNandNorUnit = {
    0: [false, false, false, true], // 0 0 0 1
    1: [false, true, true, true], // 0 1 1 1 
    2: [true, true, true, false], // 1 1 1 0
    3: [true, false, false, false], // 1 0 0 0
};

let notUnit = {
    0: [true, false],
};


module.exports = { andUnit, andNandUnit, andOrNandNorUnit, notUnit }