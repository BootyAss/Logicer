// Abstract Root class of all Inputs and Outputs
// const Connections = require('./connections')
import { Connections } from "./connections.js";
import { Sets } from "./../settings.js";
class Put {
    constructor(state, parent, id, connection) {
        this.defaultState = false;
        this.startedCLick = false;
        this.mouseDownHandler = (e) => {
            this.parent.clickedPut = this;
        };
        this.mouseUpHandler = (e) => {
            this.parent.clickedPut = this;
        };
        this.mouseMoveHandler = (e) => {
        };
        this.setState = (state) => {
            if (this.state !== state)
                this.flip();
            this.div.className = 'put ' + this.state;
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
                this.setState(con.state); // change ours state to new's
                this.parent.checkAllInputs(); // check our soutputs
            }
        };
        this.unconnect = () => {
            this.connection = null;
            this.setState(this.defaultState);
            this.parent.checkAllInputs();
        };
        this.removeSelf = () => {
            if (this.connection) {
                this.connection.unconnect();
                this.unconnect();
            }
        };
        this.styleDiv = () => {
            this.div.style.width = Sets.put.SIZE + 'px';
            this.div.style.height = Sets.put.SIZE + 'px';
        };
        this.debug = () => {
            let con = this.connection ? `${this.connection.id}` : null;
            return `{${this.id}-${this.state}-${con}}`;
        };
        this.state = state;
        this.parent = parent;
        this.id = id;
        this.connection = connection;
        this.div = document.createElement('div');
        this.div.className = 'put ' + this.state;
        this.styleDiv();
        this.div.onmousedown = this.mouseDownHandler;
        this.div.onmouseup = this.mouseUpHandler;
        this.div.onmousemove = this.mouseMoveHandler;
    }
    ;
    get name() {
        return this.constructor.name;
    }
    ;
}
;
export { Put };
