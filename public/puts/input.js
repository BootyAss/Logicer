// Abstract Parent class of all Inputs
// const Put = require('./put')
import { Put } from './put.js';
class Input extends Put {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
    ;
}
;
export { Input };
