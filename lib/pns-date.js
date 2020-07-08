module.exports = function($rootScope){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            key: "=", //选中的日期
            range: "=?",  //日期类型(非必填)，false：起始日期  true：起始日期-结束日期  也可以传字符串，字符串为分割日期的标识
            value: "=?", //初始值(非必填)
            min: '=?', //最小时间(非必填)
            max: '=?', //最大时间(非必填)
            type: "@?" //日期或时间  date:日期   datetime:日期时间
        },
        template: '<div class="pns-date">' +
                    '<input type="text" ng-model="model" class="pns-input pns-input-date" readonly>' +
                    '<div class="icon">'+
                        '<i class="iconfont iconicon_hkjhbgjl"></i>'+
                    '</div>' +
                  '</div>',
        link: function (scope, element, attr) {
            $rootScope.layPromise.then(function (layui) {
                var laydate = layui.laydate;
                laydate.render({
                    elem: element[0].children[0], //指定元素
                    range: scope.range ? "至" : false,
                    value: scope.value ? scope.value : "",
                    min: scope.min ? scope.min : "1900-1-1",
                    max: scope.max ? scope.max : "2099-12-31",
                    type: scope.type ? scope.type : "date",
                    theme: $rootScope.themeSelect.color,
                    done: function(value){
                        if(value){
                            var datetime = value.split("至");
                            if (datetime.length == 2){
                                datetime[0] = datetime[0].trim();
                                datetime[1] = datetime[1].trim();
                                scope.key = datetime;
                            } else {
                                scope.key = value;
                            }
                        } else {
                            if(scope.type == "date"){
                                scope.key = "null"
                            } else {
                                scope.key = ["null","null"]
                            }
                        }
                        scope.$apply();
                    }
                });

                $rootScope.$watch("themeSelect.color", function (val) {
                    if (val) {
                        laydate.render({
                            elem: element[0].children[0],
                            theme: $rootScope.themeSelect.color
                        });
                    }
                })

                scope.$watch("key", function (val) {
                    if (val == "") {
                        element[0].children[0].value = "";
                    }
                })

            })
        }
    }
};
