export default function(){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            targetId: "@?",  //要打印的元素id，非必填，如果不传，默认是打印当前页面
            click: "&",  //点击事件
            className: "@",  //class类
            value: "@?", //按钮名称  非必传
            icon: "@?"  //按钮图标  非必传
        },
        template: '<button class="layui-btn text-center{{className}}" ng-click="click()" >' +
                    '<i class="pns-icon {{icon}}" ng-if="icon"></i>' +
                    '<span>{{value}}</span>' +
                  '</button>',
        link: function (scope, element, attr) {
            var ele = angular.element(element);
            ele.on('click', function () {
                var id = "";
                if(scope.targetId){
                    id = scope.targetId;
                } else {
                    id = "#pns-app";
                }
                window.print();
            });

        }
    };
}