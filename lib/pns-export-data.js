module.exports = function(httpService, $rootScope){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            head: "=", //列表头key
            data: "=",  //列表list
            value: "@", //按钮名称
            root: "=", //库名
            fileName: "@?"  //文件名字
        },
        template: '<button class="layui-btn layui-btn-primary file">'+
                    '<i class="icon" ng-if="icon"></i>' +
                    '<span>{{value}}</span>'+
                  '</button>',
        link: function (scope, element, attr) {
            var ele = angular.element(element);

            ele.on('click', function (e) {
                httpService.request({
                    method: 'post',
                    url: '/exportExcel/exportExcelByDate',
                    data: {
                        "head": scope.head,
                        "data": scope.data,
                        "fileName": scope.fileName
                    },
                    isKey: false,
                    isToken: true,
                    root: scope.root
                  }).then(function (res) {
                        if(res.code == 200){
                           window.location.href = $rootScope.ROOTPATH + "/tjchb/exportExcel/export?fileName=" + scope.fileName + "&path=" + res.data.detail; 
                        }
                  });
            });
        }
    };
}