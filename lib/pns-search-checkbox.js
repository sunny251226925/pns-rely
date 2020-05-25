module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=", //选择项list
            key: "=" //选中的key  数据类型字符串 多个多项逗号分割
        },
        template: '<div class="pns-search-abc">'+
                    '<ul class="list">'+
                        '<li class="all" ng-class="{\'active\':isAll}"  ng-click="searchAll()">全部<i class="layui-icon layui-icon-ok ok"></i></li>'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-repeat="item in list" ng-bind="item.value" ng-click="selectChange(item)"></li>'+
                    '</ul>'+
                  '</div>',
        link: function(scope,element,attrs) {
           
            scope.isAll = false; //是否全选

            scope.item = []; //选中的项 list
            
            var keyList;
            if(scope.key){
                keyList = scope.key.split(",");
            } else {
                keyList = [];
            }

            scope.$watch("list",function(val,oldval){
                if(val){
                    for (var i = 0; i < scope.list.length; i++) {
                        scope.list[i].select = scope.isAll;
                    }
                }
            })

            scope.$watch("key", function (val) {
                if (val == "") {
                    for (var i = 0; i < scope.list.length; i++) {
                        scope.list[i].select = false;
                        scope.isAll = false;
                    }
                }
            })

            //全部选中事件
            scope.searchAll = function(){
                scope.isAll = !scope.isAll;
                for(var i=0; i<scope.list.length; i++){
                    scope.list[i].select = scope.isAll;
                }
                keyList = [];
                if(scope.isAll){
                    for(var i=0; i<scope.list.length; i++){
                        keyList.push(scope.list[i].key)
                    }
                }
                scope.key = keyList.join();
                
            }

            //结果集选中事件
            scope.selectChange = function(item){
                item.select = !item.select;
                if(item.select){
                    keyList.push(item.key);
                } else {
                    for(var i=0; i<scope.item.length; i++){
                        if(scope.item[i].key == item.key){
                            keyList.splice(i,1);
                        }
                    }
                }
                scope.key = keyList.join();
               
                for(var i=0; i<scope.list.length; i++){
                    if(!scope.list[i].select){
                       scope.isAll = false;
                       break;     
                    } else {
                        scope.isAll = true;
                    }
                }
            }
            
        }
    }
}