module.exports = function(httpService,$rootScope){
    return {
        restrict: 'A',
        scope: {
            list: "=?",  //数据list
            key: "=?", //选中的key
            item: "=?",  //选中的项
            root: "=?", //库名
            type: "@?",  //select类型，传入text后，select外观可变身成普通文本，不传或者传入select，恢复正常
            change: "&?", //选中事件
            disabled: "=?", //按钮状态 true:禁止操作   false：可以操作
            parentKey: "=?", //级联菜单选中的value值
            cascade: "=?", //级联对应的select的code， 数值类型字符串，如果是多个级联关系，用逗号分隔
            valueName: "@", //key名称
            titleName: "@", //title名称
            dicttypeid: "@?", //字典码ID
            placeholder: "@?", //提示文字 默认：请选择
            validate: "@?", //是否开启验证  true：开启  false：不开启  默认不开启
            validateRegex: "@?" //校验的规则
        },
        template: '<div class="pns-ng-select">' +
                        '<div class="select-input" ng-class="{\'text\': type==\'text\'}" ng-click="selectClick()">' +
                            '<input ng-model="item.name" ng-class="{\'form-disabled\':disabled}" ng-if="validate" class="input" type="text" pns-validate validate-regex="{{validateRegex}}" placeholder="{{input_placeholder}}" readonly>'+
                            '<input ng-model="item.name" ng-class="{\'form-disabled\':disabled}" ng-if="!validate" class="input" type="text" placeholder="{{input_placeholder}}" readonly>'+
                        '</div>' +
                        '<div class="select-arrow" ng-if="type != \'text\'" ng-class="{\'form-disabled\':disabled}">'+
                            '<i class="layui-icon layui-icon-down" ng-show="!listShow"></i>'+
                            '<i class="layui-icon layui-icon-up" ng-show="listShow"></i>'+
                        '</div>'+
                        '<ul class="select-list" ng-show="listShow" tabindex="1" ng-blur="selectBlur()">' +
                            '<li ng-show="selectList.length <= 0" class="item" value="" ng-click="selectChange()">无可选项</li>'+
                            '<li ng-show="selectList.length > 0 && v.codeShow" class="item" ng-class="{active: v.value==item.value}" ng-repeat="v in selectList" ng-click="selectChange(v)"  value="{{v.value}}" ng-bind="v.name"></li>'+
                        '</ul>' +
                    '</div>',
        link: function(scope,element,attrs) {
            //input placeholder 值
            if(scope.placeholder){
                scope.input_placeholder = scope.placeholder;
            } else {
                if(scope.type == "text"){
                    scope.input_placeholder = "";
                } else {
                    scope.input_placeholder = "请选择";
                }
            }

            // input list
            scope.selectList = [];

            //list 数据结构格式化
            var initList = function(list){
                if(list){
                    var selectList = [];
                    for(var i=0; i<list.length; i++){
                        selectList.push({
                            value: list[i][scope.valueName],
                            name: list[i][scope.titleName],
                            parentCode: list[i].parentCode ? list[i].parentCode : '',
                            codeShow: list[i].codeShow == undefined ? true : list[i].codeShow
                        })
                    }
                    scope.selectList = selectList;
                }
            };

            if(scope.list){
                initList(scope.list);
            }

            //通过字典码获取list
            scope.getSelectList = function(key){
                scope.selectList = [];
                if(scope.dicttypeid){
                    httpService.request({
                        method: "get",
                        url: "/eosDictEntry/list?dictTypeId=" + scope.dicttypeid,
                        root: scope.root
                    }).then(function (res) {
                        if (res.code == 200) {
                            var list = res.data;
                            for(var i=0; i<list.length; i++){
                                scope.selectList.push({
                                    value: list[i].dictid,
                                    name: list[i].dictname,
                                    codeShow: true
                                })
                            }
                            if(key){
                                for(var i=0; i<scope.selectList.length; i++){
                                    if(scope.selectList[i].value == key){
                                        scope.item = scope.selectList[i];
                                    }
                                }
                            }
                            $(element).find(".select-list").focus();
                        }
                    })
                }
            }

            //list弹窗选项
            scope.listShow = false;

            //select 点击事件
            scope.selectClick = function(){
                if(scope.type != "text"){
                    scope.listShow = true;
                    if(scope.dicttypeid){
                        if(scope.selectList.length <= 0){
                            scope.getSelectList();
                        } else {
                            setTimeout(function(){
                                $(element).find(".select-list").focus();
                            }, 300);
                        }
                    } else {
                        initList(scope.list);
                        setTimeout(function(){
                            $(element).find(".select-list").focus();
                        }, 300);
                    }
                }
            }

            //监听input默认值
            scope.$watch("key",function(val){
                if(val){
                    if(scope.dicttypeid && scope.selectList.length <= 0){
                        scope.getSelectList(val);
                    } else {
                        initList(scope.list);
                        for (i = 0; i < scope.selectList.length; i++) {
                            if(scope.parentKey){
                                if (scope.selectList[i].value == val && scope.selectList[i].parentCode == scope.parentKey) {
                                    scope.item = scope.selectList[i];
                                }
                            } else { 
                                if (scope.selectList[i].value == val) {
                                    scope.item = scope.selectList[i];
                                }
                            } 
                        }
                    }
                } else {
                    scope.item = {
                        key: "",
                        name: ""
                    }
                }
            })
 
            //select 选中事件
            scope.selectChange = function(val){
                if(val){
                    scope.item = val;
                    scope.key = val.value;
                    scope.change({item:val});
                    // scope.change({item:val,cascade:scope.cascade});
                }
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
                scope.selectList = newList;
            }

            //select 焦点失去事件
            scope.selectBlur = function(){
                scope.listShow = false;
            }
           
        }
    }
}