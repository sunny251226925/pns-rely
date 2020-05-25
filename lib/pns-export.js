export default function(httpService, $rootScope){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            columnKey: "=", //列表头key
            className: "@",  //类名
            methodName: "@",  //方法名
            methodParam: "=",  //方法参数
            value: "@" //按钮名称
        },
        template: '<button class="layui-btn layui-btn-sm layui-btn-primary file">'+
                    '<i class="icon" ng-if="icon"></i>' +
                    '<span>{{value}}</span>'+
                  '</button>',
        link: function (scope, element, attr) {
            var ele = angular.element(element);
           
            ele.on('click', function (e) {
                httpService.request({
                    method: 'post',
                    url: '/exportExcel/getExportData',
                    data: {
                        "className": scope.className,
                        "columnKeyList": scope.columnKey,
                        "methodName": scope.methodName,
                        "methodParam": scope.methodParam
                    },
                    isKey: false,
                    isToken: true,
                    root: $rootScope.rootName
                  }).then(function (res) {
                        if(res.code == 200){
                            window.location.href = res.data.downUrl;
                        }
                  });
            });
        }
    };
}