angular.module('hivesweeper', [])
    .controller('HiveController', ($scope) => {
        $scope.tiles = [
            new Tile(0, 0, false),
            new Tile(1, 0, true),
            new Tile(-1, 0, false),
            new Tile(0, 1, true),
            new Tile(0, -1, true),
            new Tile(1, -1, false),
            new Tile(-1, 1, true),
        ];

        _.forEach($scope.tiles, t => t['init']($scope.tiles));

        $scope.uncover = (tile: Tile) => {
            if (tile.isMine) {
                alert("YOU LOSE");
            } else {
                tile.uncovered = true;
                if (tile.neighbouringMineCount == 0) {
                    _.forEach(tile.neighbours, t => t.uncovered = true);
                }
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
    public neighbours: Tile[];
    public neighbouringMineCount: number;
    public uncovered: boolean;

    constructor(x, y, isMine) {
        this.coords = new Point(x, y);
        this.isMine = isMine;
    }

    public init(tiles: Tile[]) {
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