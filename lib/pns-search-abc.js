export default function(){
    return {
        restrict: 'A',
        scope: {
            list: "=", //选择项list
            key: "=", //选中的key
            item: "=?" //选中的项
        },
        template: '<div class="pns-search-abc letterDisplay">'+
                    '<ul class="search">'+
                        '<li class="all" ng-class="{\'active\':isAll}" ng-click="searchAll()">全部<i class="layui-icon layui-icon-ok ok"></i></li>'+
                        '<li class="abc" ng-class="{\'active\':select==item}" ng-repeat="item in abcList" ng-bind="item" ng-mouseenter="searchChange(item)" ></li>'+
                    '</ul>'+
                    '<ul class="list">'+
                        '<li ng-if="newList.length <= 0"><span>没有"<span ng-bind="select"></span>"的搜索结果。</span></li>'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-repeat="item in newList" ng-bind="item.value" ng-click="selectChange(item)"></li>'+
                    '</ul>'+
                  '</div>',
        link: function(scope,element,attrs) {
            scope.abcList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

            scope.isAll = false; //是否全选

            scope.key = []; //已选中的key

            scope.$watch("list", function (val, oldval) {
                if (val) {
                    for (var i = 0; i < val.length; i++) {
                        val[i].select = scope.isAll;
                    }
                    scope.newList = angular.copy(val);
                }
            })

            scope.$watch("key", function (val, oldval) {
                if(val == ""){
                    for (var i = 0; i < scope.newList.length; i++) {
                        scope.newList[i].select = false;
                    }
                }
            })

            //全部选中事件
            scope.searchAll = function(){
                scope.select = "";
                scope.isAll = !scope.isAll;
                console.log(scope.list)
                if(scope.isAll){
                    scope.newList = [];
                    scope.key = [];
                    for(var i=0; i<scope.list.length; i++){
                        scope.list[i].select = scope.isAll;
                        scope.newList.push(scope.list[i])
                        scope.key.push(scope.list[i].key);
                    }
                } else {
                    scope.newList = [];
                    scope.key.splice(0,scope.key.length);
                }
            }

            //字母选中事件
            scope.searchChange = function(item){
                scope.select = item;
                scope.newList = [];
                for(var i=0; i<scope.list.length; i++){
                    var test = scope.list[i].value.substring(0,1);
                    var pinyin = makePy(test)[0].trim();
                        pinyin = pinyin.toUpperCase();
                    if (pinyin == item){
                        scope.newList.push(scope.list[i])
                    }
                }
            }

            //结果集选中事件
            scope.selectChange = function(item){
                item.select = !item.select;
                if(scope.key == "" || !scope.key){
                    scope.key = [];
                }
                if(item.select){
                    scope.key.push(item.key);
                } else {
                    for(var i=0; i<scope.key.length; i++){
                        if(scope.key[i] == item.key){
                            scope.key.splice(i,1);
                        }
                    }
                }
                for(var i=0; i<scope.newList.length; i++){
                    if(!scope.newList[i].select){
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