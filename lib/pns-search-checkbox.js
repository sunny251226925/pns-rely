module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=", //选择项list
            key: "=", //选中的key  数据类型字符串 多个多项逗号分割
            change: "&?", //选中事件
            parentKey: "=?", //级联菜单选中的value值
            cascade: "=?" //级联对应的select的code， 数值类型字符串，如果是多个级联关系，用逗号分隔
        },
        template: '<div class="pns-search-abc">'+
                    // '<ul class="pns-list-select">'+
                    //     '<li class="item" ng-repeat="item in selectList">'+
                    //         '<span class="title" ng-bind="item.value"></span>'+
                    //         '<i class="iconfont iconremove" ng-click="removeChange(item)"></i>'+
                    //     '</li>'+
                    // '</ul>'+
                    '<ul class="list" ng-style="listStyle">'+
                        '<li class="all" ng-class="{\'active\':isAll}"  ng-click="searchAll()">全部<i class="layui-icon layui-icon-ok ok"></i></li>'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-if="item.codeShow" ng-repeat="item in list" ng-bind="item.value" ng-click="selectChange(item)"></li>'+
                    '</ul>'+
                    '<div class="more" ng-if="list.length > 10" ng-click="moreClick()">'+
                        '<span ng-show="!moreShow">更多</span>'+
                        '<span ng-show="moreShow">收起</span>'+
                        '<i class="iconfont iconarrow-down" ng-show="!moreShow"></i>'+
                        '<i class="iconfont iconarrow-up" ng-show="moreShow"></i>'+
                    '</div>'+
                  '</div>',
        link: function(scope,element,attrs) {
           
            scope.isAll = false; //是否全选

            scope.item = []; //选中的项 list

            scope.selectList = []; //已选中的项

            scope.moreShow = false;
            scope.listStyle = {
                height: "23px",
                paddingRight: "35px",
                boxSizing: "border-box"
            }
            
            scope.moreClick = function(){
                scope.moreShow = !scope.moreShow;
                if(scope.moreShow){
                    scope.listStyle = {
                        height: "auto",
                        minHeight: "23px",
                        paddingRight: "35px",
                        boxSizing: "border-box"
                    }
                } else {
                    scope.listStyle = {
                        height: "23px",
                        paddingRight: "35px",
                        boxSizing: "border-box"
                    }
                }
            }
            
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
                scope.isAll = true;
                for(var i=0; i<scope.list.length; i++){
                    scope.list[i].select = false;
                }
                keyList = "[]";
                scope.key = keyList;
                scope.selectList = [];
            }

            //结果集选中事件
            scope.selectChange = function(item){
                item.select = !item.select;
                var keyList = [];
                for(var i=0; i<scope.list.length; i++){
                    if(scope.list[i].select){
                        keyList.push(scope.list[i].key)
                    }
                }
                scope.key = keyList;
                scope.change({item:item})
            }


            //已选结果-移除
            scope.removeChange = function(item){
                for(var i=0; i<scope.selectList.length; i++){
                    if(scope.selectList[i].key == item.key){
                        scope.key.splice(i,1);
                        scope.selectList.splice(i,1);
                    }
                }
                for(var i=0; i<scope.list.length; i++){
                    if(scope.list[i].key == item.key){
                        scope.list[i].select = false;
                    }
                }
            }
            
        }
    }
}