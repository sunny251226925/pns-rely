module.exports = function(){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            keyList: "=",  //key列表
            params: "=", //搜索的参数
            search: "&?", //执行搜索
            resetStatus: "=" //用来监听是否需要重置，主要用来给pns-serach父组件使用   有值：重置   无值：不重置
        },
        template: '<div class="pns-input-search">' +
                    '<input type="text" ng-model="inputModel" ng-click="inputClick()" ng-blur="inputBlur()" class="pns-input" placeholder="{{placeholder}}">'+
                    '<ul class="select-list" ng-show="isShow" tabindex="2" ng-blur="selectBlur()">'+
                        '<li class="item" ng-repeat="item in keyList" ng-click="selectChange(item)">'+
                            '<span class="title" ng-bind="item.title+\'：\'"></span>'+
                            '<span class="text" ng-bind="inputModel"></span>'+
                        '</li>'+
                    '</ul>'+
                  '</div>',
        link: function (scope, element, attr) {
            scope.inputModel = "";
            scope.inputTitle = "";
            var placeholder = ["请输入"];
            for(var i=0; i<scope.keyList.length; i++){
                placeholder.push(scope.keyList[i].title);
            }
            scope.placeholder = placeholder.join("/");

            function getExplorerInfo() {
                var explorer = window.navigator.userAgent.toLowerCase();
                if (explorer.indexOf("msie") >= 0) {
                    var ver = explorer.match(/msie ([\d.]+)/)[1]; //ie
                    return { type: "IE", version: ver };
                } else if (explorer.indexOf("firefox") >= 0) {
                    var ver = explorer.match(/firefox\/([\d.]+)/)[1]; //firefox
                    return { type: "Firefox", version: ver };
                } else if (explorer.indexOf("chrome") >= 0) {
                    var ver = explorer.match(/chrome\/([\d.]+)/)[1]; //Chrome
                    return { type: "Chrome", version: ver };
                } else if (explorer.indexOf("opera") >= 0) {
                    var ver = explorer.match(/opera.([\d.]+)/)[1]; //Opera
                    return { type: "Opera", version: ver };
                } else if (explorer.indexOf("Safari") >= 0) {
                    var ver = explorer.match(/version\/([\d.]+)/)[1]; //Safari
                    return { type: "Safari", version: ver };
                }
            }
            var version = getExplorerInfo().version.substring(0,1);
            if(getExplorerInfo().type == "IE" && version < 9){
                setTimeout(function(){
                    $('input[placeholder]').placeholder();
                },500)
            }

            scope.inputClick = function(){
                scope.isShow = true;
                $(element).find(".select-list").focus();
            }

            scope.inputBlur = function(){

            }

            //select选择
            scope.selectChange = function(item){
                if(scope.inputModel == ""){
                    for(var key in scope.params){
                        scope.params[key] = "null";
                    }
                } else {
                    scope.params[item.code] = scope.inputModel;
                }
                
                scope.isShow = false;
                scope.search();
            }

            scope.$watch("inputModel",function(val){
                if(val == ""){
                    for(var key in scope.params){
                        scope.params[key] = "null";
                    }
                }
            })

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