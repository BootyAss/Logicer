// Abstract Root class of all Inputs and Outputs
// const Connections = require('./connections')
import { Connections } from "./connections.js";
class Put {
    constructor(state, parent, id, connection) {
        this.setState = (state) => {
            if (this.state !== state)
                this.flip();
        };
        this.flip = () => {
            this.state = !this.state;
            if (this.connection == null)
                return;
            let [, isSource] = Connections[this.name][this.connection.name];
            if (isSource)
                this.connection.parent.checkAllInputs();
        };
        this.connect = (con) => {
            let [allowCon, isSource] = Connections[this.name][con.name];
            if (!allowCon)
                throw "can't connect those";
            // clear out old connection, check output
            if (this.connection) {
                this.connection.unconnect(); // unconnect old from us
                this.unconnect(); //unconnect us from old
            }
            // clear new connection's old connection, check output
            if (con.connection) {
                con.connection.unconnect();
                con.unconnect();
            }
            con.connection = this; // connect new to us
            this.connection = con; // connect us to new
            if (isSource)
                this.connection.parent.checkAllInputs(); // check new's outputs
            else {
                this.state = con.state; // change ours state to new's
                this.parent.checkAllInputs(); // check our soutputs
            }
        };
        this.unconnect = () => {
            this.connection = null;
            this.state = this.defaultState;
            this.parent.checkAllInputs();
        };
        this.removeSelf = () => {
            if (this.connection) {
                this.connection.unconnect();
                this.unconnect();
            }
        };
        this.debug = () => {
            let con = this.connection ? `${this.connection.id}` : null;
            return `{${this.id}-${this.state}-${con}}`;
        };
        this.state = state;
        this.parent = parent;
        this.id = id;
        this.connection = connection;
    }
    ;
    get name() {
        return this.constructor.name;
    }
    ;
}
;
export { Put };
