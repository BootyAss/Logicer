import { Input } from './input.js';
class SchemeInput extends Input {
    constructor(parent, id, state = true, connection = null) {
        super(parent, id, state, connection);
        this.defaultState = true;
    }
    ;
}
;
export { SchemeInput };
