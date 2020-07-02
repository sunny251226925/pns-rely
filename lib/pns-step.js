module.exports = function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            number: "=", //当前步骤
            list: "=", //步骤list
        },
        template: '<div class="pns-step">' +
                    '<div class="item" ng-style="itemStyle" ng-class="{true: \'step\', false: \' \'}[item.number == number]" ng-repeat="item in list">'+
                        '<span class="number" ng-bind="item.number"></span>'+
                        '<span class="title" ng-bind="item.title"></span>'+
                    '</div>' +
                  '</div>',
        link: function(scope,element,attrs) {
            scope.itemStyle = {
                width: 100 / scope.list.length + "%"
            }
        }
    }
}