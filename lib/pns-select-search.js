module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=",  //数据list
            key: "=?", //选中的key
            item: "=?",  //选中的项
            change: "&?", //选中事件
            limit: "=?", //分割的条数  默认5条
            valueName: "@", //key名称
            titleName: "@", //title名称
            placeholder: "@?", //提示文字 默认：请选择
            validate: "@?", //是否开启验证  true：开启  false：不开启  默认不开启
            validateRegex: "@?" //校验的规则
        },
        template: '<div class="pns-ng-select">' +
                        '<div class="select-input" ng-click="selectClick()">' +
                            '<input ng-if="validate" class="input" type="text" pns-validate validate-regex="{{validateRegex}}" placeholder="{{input_placeholder}}" ng-keyup="selectKeyup()" >'+
                            '<input ng-if="!validate" class="input" type="text" placeholder="{{input_placeholder}}" ng-keyup="selectKeyup()" >'+
                        '</div>' +
                        '<div class="select-arrow">'+
                            '<i class="layui-icon layui-icon-down" ng-if="!listShow"></i>'+
                            '<i class="layui-icon layui-icon-up" ng-if="listShow"></i>'+
                        '</div>'+
                        '<div class="select-list-box" ng-show="listShow" tabindex="9" ng-blur="selectBlur()">'+
                            '<ul class="list" ng-click="change({item:item})">' +
                                '<li ng-if="selectList.length <= 0" class="item">无可选项</li>'+
                                '<li ng-if="selectList.length > 0" class="item" ng-class="{active: v.value==item.value}" ng-repeat="v in selectList" ng-click="selectChange(v)" ng-bind="v.name"></li>'+   
                            '</ul>' +
                            '<div class="arrow pns-row">'+
                                '<div class="pns-col-lg6 text-right"><i class="iconfont iconarrow-left"></i></div>'+
                                '<div class="pns-col-lg6 text-left"><i class="iconfont iconarrow-right"></i></div>'+
                            '</div>'+  
                        '</div>' +
                  '</div>',
        link: function(scope,element,attrs) {
            
            //input placeholder 值
            if(scope.placeholder){
                scope.input_placeholder = scope.placeholder;
            } else {
                scope.input_placeholder = "请选择";
            }

            // input list
            scope.selectList = [];

            //list 数据结构格式化
            var initList = function(list){
                var selectList = [];
                for(var i=0; i<list.length; i++){
                    selectList.push({
                        value: list[i][scope.valueName],
                        name: list[i][scope.titleName]
                    }) 
                }
                scope.selectList = selectList;
            };

            if (scope.list){
                initList(scope.list);
            }

            //list弹窗选项
            scope.listShow = false;

            //select 点击事件
            scope.selectClick = function(){
                scope.listShow = true;
                setTimeout(function(){
                    $(".select-list-box").focus();
                },200)
            }

            //监听input默认值
            scope.$watch("key",function(cur,old){
                for(i=0; i<scope.selectList.length; i++){
                    if(scope.selectList[i].value == cur){
                        scope.item = scope.selectList[i];
                    }
                }
            })

            //select 选中事件
            scope.selectChange = function(val){
                scope.item = val;
                angular.element(element).find("input")[0].value = val.name;
                scope.key = val.value;
                scope.listShow = false;
            }

            //select键盘输入事件
            scope.selectKeyup = function(){
                var name = angular.element(element).find("input")[0].value;
                var list = angular.copy(scope.list);
                initList(list);
                var newList = [];
                for(var i=0; i<scope.selectList.length; i++){
                    if(scope.selectList[i].name.indexOf(name) >= 0){
                        newList.push(scope.selectList[i]); 
                    }
                }
                $(".select-list-box").focus();
                scope.selectList = newList;
            }

            //select 焦点失去事件
            scope.selectBlur = function(){
                var name = angular.element(element).find("input")[0].value;
                var list = angular.copy(scope.list);
                initList(list);
                var isValueCheck = 0; //校验文本框内数据是否合法  0: 合法  >0 不合法   不合法的数据会置空
                for(var i=0; i<scope.selectList.length; i++){
                    if(scope.selectList[i].name == name){
                        isValueCheck++; 
                        scope.item = scope.selectList[i];
                    } 
                }
                if(isValueCheck == 0){
                    angular.element(element).find("input")[0].value = "";
                    scope.item = {};
                }
                scope.listShow = false;
            }
            
        }   
    }
}