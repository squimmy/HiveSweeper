angular.module('hivesweeper', ['directives'])
    .controller('HiveController', ($scope, $timeout) => {
        var radius = 2;
        $scope.tiles = _.flatten(_.map(
            _.range(-radius, radius + 1),
            x => _.map(
                _.range(Math.max(-radius, x - radius), Math.min(radius, x + radius) + 1),
                y => new Tile(y, x, false))));
        _.forEach(_.sample($scope.tiles, 6), (t: any) => t.isMine = true);
        _.forEach($scope.tiles, (t: any) => t.init($scope.tiles));

        $scope.transform = new Transform();

        var svg: any = document.getElementsByTagName('svg')[0];
        $scope.updateTransform = () => {
            var root = svg.firstElementChild;
            if (root != null) {
                var parentRect = svg.getBoundingClientRect();
                var childRect = root.getBoundingClientRect();
                $scope.$apply(() => {
                    $scope.transform.update(
                        parentRect.width,
                        parentRect.height,
                        childRect.width,
                        childRect.height);
                });
            }
        };
        angular.element(window).bind('resize', $scope.updateTransform);
        $timeout($scope.updateTransform, 50);
    });

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

    constructor(x, y, isMine) {
        this.coords = new Point(x, y);
        this.isMine = isMine;
    }

    public uncover() {
        if (this.flagged) return;

        if (this.isMine) {
            alert("YOU LOSE");
        } else {
            this.uncovered = true;
            if (this.neighbouringMineCount == 0) {
                _.forEach(_.filter(this.neighbours, tile => !tile.uncovered), t => t.uncover());
            }
        }
    }

    public flag() {
        if (this.uncovered) return;
        this.flagged = !this.flagged;
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