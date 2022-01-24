import { Input } from './input.js';
class SchemeInput extends Input {
    constructor(parent, id, state = true, connection = null) {
        super(parent, id, state, connection);
        this.defaultState = true;
        this.div.id = 'scheme input ' + this.id;
    }
    ;
}
;
export { SchemeInput };
