class LinePoint {
    id: number | string;
    x: number;
    y: number;
    constructor(id: number | string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
};

export { LinePoint };