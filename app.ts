angular.module('hivesweeper', [])
    .controller('HiveController', ($scope) => {
        $scope.tiles = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: -1 }
        ];
    });