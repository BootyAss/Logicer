// Abstract Parent class of all Outputs
// const Put = require('./put')
import { Put } from './put.js';
class Output extends Put {
    constructor(parent, id, state = false, connection = null) {
        super(state, parent, id, connection);
    }
    ;
}
;
;
export { Output };
