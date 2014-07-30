angular.module('directives', [])
    .directive('ngRightClick', ($parse) => {
        return ($scope, $element, $attrs) => {
            var fn = $parse($attrs.ngRightClick);
            $element.bind('contextmenu', e => {
                $scope.$apply(() => {
                    e.preventDefault();
                    fn($scope, { $event: e });
                });
            });
        };
    });
