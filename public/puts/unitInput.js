import { Input } from './input.js';
class UnitInput extends Input {
    constructor(parent, id, state = false, connection = null) {
        super(parent, id, state, connection);
        this.div.id = 'unit input ' + this.id;
    }
    ;
}
;
export { UnitInput };
