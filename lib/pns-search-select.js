module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "="
        },
        template: '<div class="pns-search-abc">'+
                    '<ul class="list">'+
                        '<li class="item" ng-class="{\'active\':item.select}" ng-repeat="item in list" ng-bind="item.name" ng-click="selectChange(item)"></li>'+
                    '</ul>'+
                  '</div>',
        link: function(scope,element,attrs) {
            scope.abcList = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
           
            scope.isAll = false; //是否全选

            //全部选中事件
            scope.searchAll = function(){
                scope.isAll = !scope.isAll;
                for(var i=0; i<scope.list.length; i++){
                    scope.list[i].select = scope.isAll;
                }
            }

            //字母选中事件
            scope.searchChange = function(item){
                scope.select = item;
            }

            //结果集选中事件
            scope.selectChange = function(item){
                item.select = !item.select;
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