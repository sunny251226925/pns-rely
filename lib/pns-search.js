module.exports = function($rootScope, httpService){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            reqEntry: "@", //高级搜索接口的参数
            queryEvent: "&", //查询接口的名称
            queryParams: "=", //查询表单参数
            reset: "=?", //重置函数
            border: "=?" //表单线框  true：显示  false：不显示    默认显示
        },
        template: '<div class="pns-search">'+
                        '<div class="content" ng-show="otherList.length + inputList.length > 0" ng-class="{true:\'border\',false:\'\'}[border==undefined?true:border]">'+
                            '<table class="table search">' +
                                '<tbody>' +
                                    '<tr>'+
                                        '<td class="search-label" ng-if="inputList.length > 1">查询条件</td>' +
                                        '<td class="search-label" ng-if="inputList.length <= 1" ng-bind="labelTitle"></td>' +
                                        '<td class="search-content">'+
                                            '<div ng-if="inputList.length > 1" pns-input-search reset-status="inputSearchReset" params="inputListKey" key-list="inputList"></div>' +
                                            '<input ng-if="inputList.length <= 1" ng-model="inputListKey[inputKeyFist]" class="pns-input pns-ng-select">' +
                                        '</td>'+
                                    '</tr>'+
                                    '<tr ng-repeat="item in otherList" ng-show="$index<limit">' +
                                        '<td class="search-label" ng-class="{\'line20\':item.title.length>6}" ng-bind="item.title+\'：\'"></td>' +
                                        '<td class="search-content">' +
                                            '<div ng-if="item.type == \'Select\'" pns-select list="item.data" parent-key="parentKey" cascade="item.childDictTypeId" key="params[item.code]" value-name="key" title-name="value" change="selectChange(item,cascade)"></div>' +
                                            '<div ng-if="item.type == \'Radio\'" pns-search-radio list="item.data" key="params[item.code]" ></div>' +
                                            '<div ng-if="item.type == \'SelectSearch\'" pns-select-search list="item.data" key="params[item.code]" value-name="key" title-name="value"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && item.letterDisplay" pns-search-abc list="item.data" key="params[item.code]"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && !item.letterDisplay" pns-search-checkbox list="item.data" key="params[item.code]"></div>' +
                                            '<div ng-if="item.type == \'DateRange\'" pns-date range="range" key="params[item.code]"></div>' +
                                        '</td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table >' +
                        '</div>'+
                        '<div class="footer text-right">' +
                            '<button pns-button class-name="search-btn layui-btn-sm" click="query()" value="搜索" ></button>' +
                            '<button pns-button class-name="layui-btn-primary layui-btn-sm" click="reset()" value="重置" ></button>' +
                            '<span class="fold" ng-click="hideQuery()" ng-if="limit>=4 && otherList.length > 3">收起筛选条件<i class="iconfont iconicon-top"></i></span>'+
                            '<span class="fold" ng-click="showQuery()" ng-if="limit<4 && otherList.length > 3">展开筛选条件<i class="iconfont iconicon-bottom"></i></span>' +
                        '</div>' +
                  '</div>',
        link: function (scope, element, attr) {

            scope.limit = 3;

            scope.inputListKey = {};

            scope.queryParams = {};

            scope.hideQuery = function(){
                scope.limit = 3;
            }

            scope.showQuery = function () {
                console.log(scope.otherList.length)
                scope.limit = scope.otherList.length;
            }

            scope.selectChange = function(item,cascade){
                var selectKey = item.value;
                if(cascade){
                    scope.parentKey = item.value;
                }
                if(cascade){
                    var cascadeList = cascade.split(",");
                    for(var i=0; i<cascadeList.length; i++){
                        scope.params[cascadeList[i]] = "";
                        for(var j=0; j<scope.otherList.length; j++){
                            if(scope.otherList[j].code == cascadeList[i]){
                                for(var k=0;k<scope.otherList[j].data.length; k++){
                                    if(scope.otherList[j].data[k].parentCode == selectKey){
                                        scope.otherList[j].data[k].codeShow = true;
                                    } else {
                                        scope.otherList[j].data[k].codeShow = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //表单参数
            scope.params = {};

            //高级搜索inputs
            scope.inputList = [];
            scope.otherList = [];

            httpService.request({
                method: "get",
                url: "/searchPanel/hightSearchList",
                isKey: false,
                isToken: true,
                data: {
                    reqEntry: scope.reqEntry
                },
                root: $rootScope.rootName
            }).then(function (res) {
                if (res.code == 200) {
                    var result = res.data;
                    var key = "";
                    var dateType = "";
                    var childDictTypeIdList = [];

                    for (var i = 0; i < result.length; i++){
                        key = result[i].code;
                        scope.params[key] = "";

                        if (result[i].type == "DateRange"){
                            dateType = result[i].code.split(",");
                            if(dateType.length == 2){
                                scope.range = true
                            } else {
                                scope.range = false
                            }
                        }
                        if(result[i].data){
                            for(var j=0; j<result[i].data.length; j++){
                                result[i].data[j].codeShow = true;
                            }
                        }
                        if(result[i].childDictTypeId){
                            var array = result[i].childDictTypeId.split(",");
                            for(var j=0;j<array.length;j++){
                                childDictTypeIdList.push(array[j]);
                            }
                        }
                    }

                    for(var i=0; i<childDictTypeIdList.length; i++){
                        for(var j=0; j<result.length; j++){
                            if(result[j].code == childDictTypeIdList[i]){
                                if(result[j].data){
                                    for(var k=0;k<result[j].data.length; k++){
                                        result[j].data[k].codeShow = false;
                                    }
                                }
                            }
                        }
                    }

                    scope.inputKeyFist = "";
                    for(var i=0; i<result.length; i++){
                        //合并Input
                        if(result[i].type == "Input"){
                            scope.inputKeyFist = result[i].code;
                            scope.labelTitle = result[i].title;
                            scope.inputList.push(result[i]);
                            scope.inputListKey[result[i].code] = "";
                        } else {
                            scope.otherList.push(result[i])
                        }
                    }
                    scope.searchList = result;
                    scope.query();
                }
            })


            var deleteKey = []; //被删除的key
            //过滤需要传递的参数
            var paramsFilter = function(){
                var keyArray = []; 
                //识别key中有逗号需要分割的变量名称，重新定义变量名称
                for (var key in scope.params) {
                    if (key.indexOf(",") > 0) {
                        keyArray = key.split(",");
                        for (var i = 0; i < keyArray.length; i++) {
                            scope.params[keyArray[i]] = scope.params[key][i];
                        }
                        deleteKey.push(key);
                        delete scope.params[key];
                    }
                }

                //判断值为undefined的改为""
                for (var key in scope.params) {
                    if (!scope.params[key]) {
                        scope.params[key] = "";
                    }
                }
            }
            
            scope.query = function(){
                paramsFilter();
                for(var key in scope.params){
                    if(scope.params[key]){
                        if(scope.params[key].length > 0){
                            scope.queryParams[key] = scope.params[key];
                        }
                    }
                }
                for(var key in scope.inputListKey){
                    scope.queryParams[key] = scope.inputListKey[key];
                }
                scope.queryEvent({page:{page:1}});
            }

            //重置
            scope.reset = function(){
                scope.inputSearchReset = Math.random();
                for (var key in scope.params){
                    scope.params[key] = "";
                }
                for (var i = 0; i < deleteKey.length; i++) {
                    scope.params[deleteKey[i]] = "";
                }
                scope.inputListKey[scope.inputKeyFist] = "";
                scope.queryParams = {};
            }
        }
    };
}