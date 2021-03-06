module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=", //选择项list
            key: "=", //选中的key
            item: "=?", //选中的项
            change: "&?", //选中事件
            parentKey: "=?", //级联菜单选中的value值
            cascade: "=?" //级联对应的select的code， 数值类型字符串，如果是多个级联关系，用逗号分隔
        },
        template: '<div class="pns-search-abc">'+
                    '<ul class="list" ng-style="listStyle">'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-repeat="item in list" ng-bind="item.value" ng-click="selectChange(item)"></li>'+
                    '</ul>'+
                    '<div class="more" ng-if="list.length > 10" ng-click="moreClick()">'+
                        '<span ng-show="!moreShow">更多</span>'+
                        '<span ng-show="moreShow">收起</span>'+
                        '<i class="iconfont iconarrow-down" ng-show="!moreShow"></i>'+
                        '<i class="iconfont iconarrow-up" ng-show="moreShow"></i>'+
                    '</div>'+
                  '</div>',
        link: function(scope,element,attrs) {

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

            scope.$watch("list",function(val){
                if(val){
                    for (var i = 0; i < scope.list.length; i++) {
                        scope.list[i].select = false;
                    }
                }
            })

            scope.$watch("key", function (val) {
                if (val == "") {
                    if(scope.list){
                        for (var i = 0; i < scope.list.length; i++) {
                            scope.list[i].select = false;
                        }
                    }
                } else {
                    if(scope.cascade){
                        scope.change({item:scope.item,cascade:scope.cascade})
                    }
                }
            })

            //结果集选中事件
            scope.selectChange = function(item){
                for(var i=0; i<scope.list.length; i++){
                    if(scope.list[i].key != item.key){
                        scope.list[i].select = false;
                    }
                }
                item.select = !item.select;
                if(item.select){
                    scope.key = item.key;
                    scope.item = item;
                } else {
                    scope.key = "null";
                    scope.item = {};
                }
            }
        }
    }
}