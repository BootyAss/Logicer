import { Output } from './output.js';
class SchemeOutput extends Output {
    constructor(parent, id, state = false, connection = null) {
        super(parent, id, state, connection);
        this.div.id = 'scheme output ' + this.id;
    }
    ;
}
;
export { SchemeOutput };
