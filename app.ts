angular.module('hivesweeper', ['directives', 'ui.bootstrap'])
    .controller('HiveController', ($scope, $timeout) => {
        $scope.easy = Difficulty.easy();
        $scope.medium = Difficulty.medium();
        $scope.hard = Difficulty.hard();
        $scope.difficulty = $scope.easy;

        $scope.startGame = () => {
            var radius = $scope.difficulty.hiveRadius;
            $scope.tiles = _.flatten(_.map(
                _.range(-radius, radius + 1),
                x => _.map(
                    _.range(Math.max(-radius, x - radius), Math.min(radius, x + radius) + 1),
                    y => new Tile(y, x, false))));
            _.forEach(_.sample($scope.tiles, $scope.difficulty.mineCount), (t: Tile) => t.isMine = true);
            _.forEach($scope.tiles, (t: Tile) => t.init($scope.tiles, () => {
                $scope.showLoseDialog = true;
            }));
            $scope.transform = new Transform();
            if ($scope.updateTransform != null) $timeout($scope.updateTransform, 50);
        }

        $scope.showLoseDialog = false;
        $scope.startGame();

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

        $scope.remainingMineCount = () => {
            return _.filter($scope.tiles, (t: Tile) => t.isMine && !t.flagged).length
        }
        $scope.startNewGame = () => {
            $scope.startGame();
            $scope.showLoseDialog = false;
        };
        angular.element(window).bind('resize', $scope.updateTransform);
        $timeout($scope.updateTransform, 50);
    });
