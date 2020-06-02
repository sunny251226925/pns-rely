module.exports = function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            click: "&",  //点击事件
            className: "@",  //class类
            value: "@?", //按钮名称  非必传
            icon: "@?"  //按钮图标  非必传
        },
        template: '<button class="layui-btn text-center {{className}}" ng-click="click()" >'+
                    '<i class="iconfont {{icon}}" ng-if="icon"></i>' +
                    '<span>{{value}}</span>'+
                    '</button>',
        link: function (scope, element, attr) {
            
        }
    }    
};