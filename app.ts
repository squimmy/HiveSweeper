angular.module('hivesweeper', [])
    .controller('HiveController', ($scope) => {
        $scope.tiles = [
            new Tile(0, 0, false),
            new Tile(1, 0, true),
            new Tile(-1, 0, false),
            new Tile(0, 1, true),
            new Tile(0, -1, true),
            new Tile(1, 1, false),
            new Tile(-1, -1, true)
        ];

        $scope.uncover = (tile: Tile) => {
            if (tile.isMine) {
                alert("YOU LOSE");
            } else {
                alert(tile.countNearbyMines($scope.tiles));
            }
        }
    });

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
    public neighbours: Point[];

    constructor(x, y, isMine) {
        this.coords = new Point(x, y);
        this.isMine = isMine;
        this.neighbours = this.getNeighbours();
    }

    private getNeighbours() {
        var relativeNeighbours = [
            new Point(1, 0),
            new Point(1, 1),
            new Point(0, -1),
            new Point(0, 1),
            new Point(-1, 0),
            new Point(-1, -1)
        ];
        return _.map(relativeNeighbours, p => new Point(p.x + this.coords.x, p.y + this.coords.y));
    }

    public countNearbyMines(tiles: Tile[]) {
        var neighbouringTiles = _.filter(tiles, t => _.some(this.neighbours, n => n.x == t.coords.x && n.y == t.coords.y));
        return _.countBy(neighbouringTiles, t => t.isMine)['true'];
    }
}