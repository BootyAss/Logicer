// Abstract Root class of all Inputs and Outputs

const Connections = require('./connections')

module.exports = class Put {
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

    flip = () => this.state = !(this.state);

    connect = (con) => {
        let [allowCon, isSource] = Connections[this.name][con.name];
        if (!allowCon)
            throw 'can\'t connect those';

        if (this.connection) {
            this.connection.connection = false;
            this.connection.state = this.connection.defaultState;
        }

        con.connection = this;
        this.connection = con;

        if (isSource)
            con.state = this.state;
        else
            this.state = con.state;

        this.parent.checkToShowOutput();
        con.parent.checkToShowOutput();
    }

    unconnect = () => {
        if (this.connection)
            this.connection.unconnect();
        this.connection = null;
    }

    checkConnection = (con) => {
        return;
    }


    debug = () => {
        let con = this.connection ? `${this.connection.id}` : null;
        return `{${this.id}-${this.state}-${con}}`;
    }
}