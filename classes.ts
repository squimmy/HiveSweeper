class Transform {
    private offsetX: number;
    private offsetY: number;
    private scale: number;

    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
    }

    public update(parentX: number, parentY: number, childX: number, childY: number) {
        childX /= this.scale;
        childY /= this.scale;

        var rX = parentX / childX;
        var rY = parentY / childY;

        this.scale = Math.min(rX, rY) * 0.9;

        this.offsetX = (childX / 2) * this.scale * 1.05;
        this.offsetY = (childY / 2) * this.scale * 1.05;
    }

    public text() {
        return 'translate(' + this.offsetX + ', ' + this.offsetY + ') scale(' + this.scale + ')';
    }
}

class Point {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Tile {
    public coords: Point;
    public isMine: boolean;
    public neighbours: Tile[];
    public neighbouringMineCount: number;
    public uncovered: boolean;
    public flagged: boolean;
    private lose: () => void;
    private tryWin: () => void;

    constructor(x, y, isMine) {
        this.coords = new Point(x, y);
        this.isMine = isMine;
    }

    public uncover() {
        if (this.flagged) return;

        if (this.isMine) {
            this.lose();
        } else {
            this.uncovered = true;
            if (this.neighbouringMineCount == 0) {
                _.forEach(_.filter(this.neighbours, tile => !tile.uncovered), t => t.uncover());
            }
            this.tryWin();
        }
    }

    public flag() {
        if (this.uncovered) return;
        this.flagged = !this.flagged;
    }

    public init(tiles: Tile[], lose: () => void, tryWin: () => void) {
        this.lose = lose;
        this.tryWin = tryWin;

        var relativeNeighbours = [
            new Point(1, 0),
            new Point(1, 1),
            new Point(0, -1),
            new Point(0, 1),
            new Point(-1, 0),
            new Point(-1, -1)
        ];
        var neighbours = _.map(relativeNeighbours, p => new Point(p.x + this.coords.x, p.y + this.coords.y));
        this.neighbours = _.filter(tiles, t => _.some(neighbours, n => n.x == t.coords.x && n.y == t.coords.y));
        this.neighbouringMineCount = _.filter(this.neighbours, t => t.isMine).length;
    }
}

class Difficulty {
    public hiveRadius: number;
    public mineCount: number;
    public name: string;

    constructor(radius: number, mines: number, name: string) {
        this.hiveRadius = radius;
        this.mineCount = mines;
        this.name = name;
    }

    static easy() {
        return new Difficulty(3, 5, 'Easy');
    }
    static medium() {
        return new Difficulty(5, 15, 'Medium');
    }
    static hard() {
        return new Difficulty(7, 25, 'Hard');
    }
}
 