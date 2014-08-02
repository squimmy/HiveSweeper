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
    })
    .directive('ngDialog', ($parse) => {
        return ($scope, $element, $attrs) => {
            var fn = $parse($attrs.buttonAction);
            $($element).dialog({
                closeOnEscape: false,
                dialogClass: 'no-title-bar',
                autoOpen: false,
                modal: true,
                buttons: [{
                    text: $attrs.buttonText,
                    click: () => $scope.$apply(() => {
                        fn($scope);
                    })
                }]
            });

            $attrs.$observe('isOpen', x => {
                if ($parse(x)()) {
                    $($element).dialog('open');
                } else {
                    $($element).dialog('close');
                }
            });
        };
    })
    .directive('difficultyPicker', () => {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            templateUrl: 'difficultyPicker.html',
        };
    });