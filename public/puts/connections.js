// Represents legitamancy of connections From -> To
// Returns [
//      Permission of connection,
//      Is start of connection Source
// ]
var Connections = {
    SchemeInput: {
        SchemeInput: [false, false],
        SchemeOutput: [true, true],
        UnitInput: [true, true],
        UnitOutput: [false, false],
    },
    SchemeOutput: {
        SchemeInput: [true, false],
        SchemeOutput: [false, false],
        UnitInput: [false, false],
        UnitOutput: [true, false],
    },
    UnitInput: {
        SchemeInput: [true, false],
        SchemeOutput: [false, false],
        UnitInput: [false, false],
        UnitOutput: [true, false],
    },
    UnitOutput: {
        SchemeInput: [false, false],
        SchemeOutput: [true, true],
        UnitInput: [true, true],
        UnitOutput: [false, false],
    }
};
export { Connections };
