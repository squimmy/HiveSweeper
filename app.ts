angular.module('hivesweeper', ['directives'])
    .controller('HiveController', ($scope) => {
        var radius = 2;
        $scope.tiles = _.flatten(_.map(
            _.range(-radius, radius + 1),
            x => _.map(
                _.range(Math.max(-radius, x - radius), Math.min(radius, x + radius) + 1),
                y => new Tile(y, x, false))));

        _.forEach(_.sample($scope.tiles, 6), t => t['isMine'] = true);
        _.forEach($scope.tiles, t => t['init']($scope.tiles));

        $scope.uncover = (tile: Tile) => {
            if (tile.isMine) {
                alert("YOU LOSE");
            } else {
                tile.uncover();
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

    public uncover() {
        this.uncovered = true;
        if (this.neighbouringMineCount == 0) {
            _.forEach(_.filter(this.neighbours, tile => !tile.uncovered), t => t.uncover());
        }
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