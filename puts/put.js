// Abstract Root class of all Inputs and Outputs

// const Connections = require('./connections')
import { Connections } from './connections.js';

export class Put {
    state = false;
    parent = null;
    id = 0;
    connection = null;
    defaultState = false;

    constructor(state, parent, id, connection) {
        this.state = state;
        this.parent = parent;
        this.id = id;
        this.connection = connection;
    }

    get state() { return this.state; }
    set state(state) { this.state = state; }
    get parent() { return this.parent; }
    get id() { return this.id; }
    get connection() { return this.connection; }
    set connection(con) { this.connection = con; }
    get name() { return this.constructor.name; }

    setState = (state) => {
        if (this.state !== state)
            this.flip();
    }

    flip = () => {
        this.state = !(this.state);
        if (this.connection == null)
            return;

        let [, isSource] = Connections[this.name][this.connection.name];
        if (isSource) {
            this.connection.parent.checkAllInputs();
        }
    };

    connect = (con) => {
        let [allowCon, isSource] = Connections[this.name][con.name];
        if (!allowCon)
            throw 'can\'t connect those';

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

        if (isSource) { // if we are giver -> new is gainer
            this.connection.parent.checkAllInputs(); // check new's outputs
        } else {
            this.state = con.state; // change ours state to new's
            this.parent.checkAllInputs(); // check our soutputs
        }
    }

    unconnect = () => {
        this.connection = null;
        this.state = this.defaultState;
        this.parent.checkAllInputs();
    }

    removeSelf = () => {
        if (this.connection) {
            this.connection.unconnect();
            this.unconnect();
        }
    }

    debug = () => {
        let con = this.connection ? `${this.connection.id}` : null;
        return `{${this.id}-${this.state}-${con}}`;
    }
}