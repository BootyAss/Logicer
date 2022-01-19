module.exports = {
    SchemeInput: {
        SchemeInput: [false, null],
        SchemeOutput: [true, true],
        UnitInput: [true, true],
        UnitOutput: [false, null],
    },
    SchemeOutput: {
        SchemeInput: [true, false],
        SchemeOutput: [false, null],
        UnitInput: [false, null],
        UnitOutput: [true, false],
    },
    UnitInput: {
        SchemeInput: [true, false],
        SchemeOutput: [false, null],
        UnitInput: [false, null],
        UnitOutput: [true, false],
    },
    UnitOutput: {
        SchemeInput: [false, null],
        SchemeOutput: [true, true],
        UnitInput: [true, true],
        UnitOutput: [false, null],
    }
}