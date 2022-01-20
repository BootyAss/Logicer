// Abstract Root class of all Inputs and Outputs

// const Connections = require('./connections')
import { Connections } from "./connections";
import { Block } from "./../blocks/block";


class Put {
    state: boolean;
    parent: Block;
    id: number;
    connection: Put;
    defaultState: boolean;

    constructor(state: boolean, parent: Block, id: number, connection: Put) {
        this.state = state;
        this.parent = parent;
        this.id = id;
        this.connection = connection;
    };

    get name(): string {
        return this.constructor.name;
    };

    setState = (state: boolean): void => {
        if (this.state !== state)
            this.flip();
    };

    flip = (): void => {
        this.state = !this.state;
        if (this.connection == null)
            return;

        let [, isSource]: [boolean, boolean] = Connections[this.name][this.connection.name];
        if (isSource)
            this.connection.parent.checkAllInputs();
    };

    connect = (con: Put): void => {
        let [allowCon, isSource]: [boolean, boolean] = Connections[this.name][con.name];

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

    unconnect = (): void => {
        this.connection = null;
        this.state = this.defaultState;
        this.parent.checkAllInputs();
    };

    removeSelf = (): void => {
        if (this.connection) {
            this.connection.unconnect();
            this.unconnect();
        }
    };

    debug = (): string => {
        let con = this.connection ? `${this.connection.id}` : null;
        return `{${this.id}-${this.state}-${con}}`;
    };
};


export { Put };
