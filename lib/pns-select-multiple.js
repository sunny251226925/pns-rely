var app = require("../../app");

app.directive("pnsSelectMultiple",function () {
    return {
        restrict: 'A',
        scope: {
            list: "=", //列表list
            select: "=", //已选中的结果list
            validate: "@?", //是否开启验证  true：开启  false：不开启  默认不开启
            validateRegex: "@?" //校验的规则
        },
        template: '<div class="pns-ng-select pns-search-tree">'+
                    '<div class="select-input" ng-class="{\'text\': type==\'text\'}" ng-click="searchInputClick()">' +
                        '<input ng-model="selectString" ng-class="{\'form-disabled\':disabled}" ng-if="validate" class="input" type="text" pns-validate validate-regex="{{validateRegex}}" placeholder="{{input_placeholder}}" readonly>'+
                        '<input ng-model="selectString" ng-class="{\'form-disabled\':disabled}" ng-if="!validate" class="input" type="text" placeholder="{{input_placeholder}}" readonly>'+
                    '</div>' +
                    '<div class="select-arrow" ng-if="type != \'text\'" ng-class="{\'form-disabled\':disabled}">'+
                        '<i class="layui-icon layui-icon-down" ng-show="!listShow"></i>'+
                        '<i class="layui-icon layui-icon-up" ng-show="listShow"></i>'+
                    '</div>'+
                    '<div class="search-mask" ng-show="searchListShow" ng-click="hideModal($event)"></div>'+
                    '<div class="search-list" tabindex="0" ng-show="searchListShow">'+
                        '<li class="multiple" ng-repeat="item in list" ng-click="selectChange(item)">'+
                            '<input type="checkbox" ng-checked="item.checked" >'+
                            '<span ng-bind="item.name"></span>' +
                        '</li>'+
                    '</div>'+
                  '</div>',
        link: function(scope,element,attrs) {
 
            if(scope.placeholder){
                scope.input_placeholder = scope.placeholder;
            } else {
                if(scope.type == "text"){
                    scope.input_placeholder = "";
                } else {
                    scope.input_placeholder = "请选择";
                }
            }

            //搜索结果集弹层   false：隐藏   true：呈现
            scope.searchListShow = false;

            //搜索input点击事件
            scope.searchInputClick = function(){
                scope.searchListShow = !scope.searchListShow;
            }

            //选中事件
            scope.selectChange = function(item){
                item.checked = !item.checked;
                if(item.checked){
                    scope.select.push(item);
                } else {
                    for(var i=0; i<scope.select.length; i++){
                        if(scope.select[i].code == item.code){
                            scope.select.splice(i,1);
                        }
                    }
                }

                var selectString = [];
                for(var i=0; i<scope.select.length; i++){
                    selectString.push(scope.select[i].name);
                }
                scope.selectString = selectString.join(",");
            }


            scope.$watch("list",function(val){
                if(val.length > 0){    
                    scope.select = [];
                    var selectString = [];
                    for(var i=0; i<val.length; i++){
                        if(val[i].checked){
                            selectString.push(val[i].name);
                            scope.select.push(val[i]);
                        }
                    }
                    scope.selectString = selectString.join(",");
                }
            })

            scope.$watch("select",function(val){
                if(val.length == 0){
                    scope.selectString = "";
                }
            })

            //移除已选中的项
            scope.unoChecked = function(item){
                for(var i=0; i<scope.list.length; i++){
                    if(scope.list[i].title == item.title){
                        scope.list.splice(i,1);
                    }
                }
                scope.searchListShow = false;
            }
           
          
            //隐藏弹层
            scope.hideModal = function(e){
                scope.searchListShow = false;
            }

        }
    }
});
