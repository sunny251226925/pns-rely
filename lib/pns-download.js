export default function($location,$rootScope){
    return {
        restrict: 'A',
        scope: {
            fileId: '@'
        },
        link: function (scope, element) {
            var ele = angular.element(element);
            ele.on('click', function () {
                window.location.href = $rootScope.ROOTPATH + "/download/" + scope.fileId;
            });
        }
    }
};