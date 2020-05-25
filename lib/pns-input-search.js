export default function(){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            keyList: "=",  //key列表
            params: "=", //搜索的参数
            resetStatus: "=" //用来监听是否需要重置，主要用来给pns-serach父组件使用   有值：重置   无值：不重置
        },
        template: '<div class="pns-input-search">' +
                    '<input type="text" ng-model="inputModel" ng-click="inputClick()" class="pns-input" placeholder="{{placeholder}}">'+
                    '<ul class="select-list" ng-show="isShow" tabindex="2" ng-blur="selectBlur()">'+
                        '<li class="item" ng-repeat="item in keyList" ng-click="selectChange(item)">'+
                            '<span class="title" ng-bind="item.title+\'：\'"></span>'+
                            '<span class="text" ng-bind="inputModel"></span>'+
                        '</li>'+
                    '</ul>'+
                  '</div>',
        link: function (scope, element, attr) {
            scope.inputModel = "";
            var placeholder = ["请输入"];
            for(var i=0; i<scope.keyList.length; i++){
                placeholder.push(scope.keyList[i].title);
            }
            scope.placeholder = placeholder.join("/");

            scope.inputClick = function(){
                scope.isShow = true;
                $(element).find(".select-list").focus();
            }

            //select选择
            scope.selectChange = function(item){
                for(var key in scope.params){
                    scope.params[key] = "";
                }
                scope.params[item.code] = scope.inputModel;
                scope.isShow = false;
            }

            //select 焦点失去事件
            scope.selectBlur = function(){
                scope.isShow = false;
            }

            //重置
            scope.resetFn = function(){
                $(element).find(".pns-input").val("");
                for(var key in scope.params){
                    scope.params[key] = "";
                }
                scope.inputModel = "";
            }
            
            scope.$watch("resetStatus",function(val){
                if(val){
                    scope.resetFn();
                }
            })
        }
    };
}