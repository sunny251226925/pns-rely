module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=", //选择项list
            key: "=", //选中的key
            item: "=?" //选中的项
        },
        template: '<div class="pns-search-abc ">'+
                    '<ul class="search">'+
                        '<li class="all" ng-class="{\'active\':isAll}" ng-click="searchAll()">全部<i class="layui-icon layui-icon-ok ok"></i></li>'+
                        '<li class="abc" ng-class="{\'active\':select==item}" ng-repeat="item in abcList" ng-bind="item" ng-mouseenter="searchChange(item)" ng-click="searchClick(item)"></li>'+
                    '</ul>'+
                    '<div class="more" ng-click="moreClick()">'+
                        '<span ng-show="!moreShow">更多</span>'+
                        '<span ng-show="moreShow">收起</span>'+
                        '<i class="iconfont iconarrow-down" ng-show="!moreShow"></i>'+
                        '<i class="iconfont iconarrow-up" ng-show="moreShow"></i>'+
                    '</div>'+
                    '<div class="list box-sizing" ng-style="listStyle">'+
                        '<div class="result-search" ng-show="moreShow">'+
                            '<input class="pns-input right" style="width:240px;" ng-model="result.value" placeholder="关键词搜索..." ng-keyup="resultKeyup()">'+
                            '<i class="iconfont iconicons_search_home"></i>'+
                        '</div>'+
                        '<p ng-if="newList.length <= 0 || reslutList.length <= 0"><span style="padding-left:5px">没有"<span ng-bind="select"></span>"的搜索结果。</span></p>'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-repeat="item in newList" ng-show="item.show" ng-bind="item.value" ng-click="selectChange(item)"></li>'+
                    '</div>'+
                  '</div>',
        link: function(scope,element,attrs) {
            scope.abcList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

            scope.isAll = false; //是否全选

            scope.key = []; //已选中的key

            scope.isEnter = false; //是否启动字母划入筛选事件   false：不启动   true：启动

            //letterDisplay
            scope.listStyle = {
                height: "auto",
                border: "0",
                overflowY: "auto",
                overflowX: "hidden"
            }

            scope.$watch("list", function (val, oldval) {
                if (val) {
                    for (var i = 0; i < val.length; i++) {
                        val[i].select = scope.isAll;
                        val[i].show = true;
                    }
                    scope.newList = angular.copy(val);
                    if(scope.newList.length > 30){
                        scope.listStyle = {
                            height: "130px",
                            border: "#ddd solid 1px",
                            overflowY: "auto",
                            overflowX: "hidden"
                        }
                        scope.moreShow = true;
                    }
                }
            })
            
            scope.$watch("key", function (val, oldval) {
                if(!val && val != oldval){
                    if(scope.newList){
                        for (var i = 0; i < scope.newList.length; i++) {
                            scope.newList[i].select = false;
                            scope.newList[i].show = true;
                        }
                    }
                }
            })

            //全部选中事件
            scope.searchAll = function(){
                scope.isAll = true;
                for(var i=0; i<scope.newList.length; i++){
                    scope.newList[i].select = false;
                }
                scope.key = "[]";
            }

            //更多
            scope.moreClick = function(){
                scope.moreShow = !scope.moreShow;
                if(scope.moreShow){
                    scope.listStyle = {
                        height: "130px",
                        border: "#ddd solid 1px",
                        overflowY: "auto",
                        overflowX: "hidden"
                    }
                } else {
                    scope.listStyle = {
                        height: "auto",
                        border: "0",
                        overflowY: "auto",
                        overflowX: "hidden"
                    };
                    scope.newList = angular.copy(scope.list);
                    scope.isEnter = false;
                    scope.select = "";
                }
            }

            //字母点击事件
            scope.searchClick = function(item){
                scope.isEnter = true;
                scope.moreShow = true;
                scope.listStyle = {
                    height: "130px",
                    border: "#ddd solid 1px",
                    overflowY: "auto",
                    overflowX: "hidden"
                };
                scope.searchChange(item);
            }

            //字母选中事件
            scope.searchChange = function(item){
                if(scope.isEnter){
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
                    scope.key = scope.key == "" ? [] : scope.key;
                    if(scope.key.length > 0){
                        for(var i=0; i<scope.newList.length; i++){
                            if(scope.key.indexOf(scope.newList[i].key) >= 0){
                                scope.newList[i].select = true;
                            }
                        }
                    }
                }
            }

            //结果集选中事件
            scope.selectChange = function(item){
                item.select = !item.select;
                if(scope.key == "[]" || !scope.key){
                    scope.key = [];
                }
                if(item.select){
                    scope.isAll = false;
                    scope.key.push(item.key);
                } else {
                    for(var i=0; i<scope.key.length; i++){
                        if(scope.key[i] == item.key){
                            scope.key.splice(i,1);
                        }
                    }
                }
            }

            //结果集搜索事件
            scope.result = {
                value: ""
            };
            scope.resultKeyup = function(){
                scope.select = scope.result.value;
                scope.reslutList = [];
                for(var i=0; i<scope.newList.length; i++){
                    if(scope.newList[i].value.indexOf(scope.result.value) >= 0){
                        scope.newList[i].show = true;
                        scope.reslutList.push(scope.newList[i]);
                    } else {
                        scope.newList[i].show = false;
                    }
                }
            }

        }
    }
}