import { Output } from './output.js';
class UnitOutput extends Output {
    constructor(parent, id, state = false, connection = null) {
        super(parent, id, state, connection);
        this.div.id = 'unit output ' + this.id;
    }
    ;
}
;
export { UnitOutput };
