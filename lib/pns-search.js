module.exports = function($rootScope, httpService, sessionFactory, $location){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            reqEntry: "@", //高级搜索接口的参数
            queryEvent: "&", //查询接口的名称
            queryParams: "=", //查询表单参数
            reset: "=?", //重置函数
            root: "=", //库名
            symbol: "=", //触发请求的开关   0：关闭    >0:打开
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
                                            '<div ng-if="inputList.length > 1" pns-input-search reset-status="inputSearchReset" search="query()" params="inputListKey" key-list="inputList"></div>' +
                                            '<input ng-if="inputList.length <= 1" ng-model="inputListKey[inputKeyFist]" class="pns-input pns-ng-select">' +
                                        '</td>'+
                                    '</tr>'+
                                    '<tr ng-repeat="item in otherList">' +
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
                                    '<tr ng-repeat="item in moreList" ng-show="item.show">' +
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
                            '<span class="fold" ng-click="showQuery()" >更多筛选条件<i class="iconfont iconicon-bottom"></i></span>' +
                        '</div>' +
                        '<div class="modal" id="{{modal_id}}">'+
                            '<div class="modal-content">'+
                                '<div style="width:290px">'+
                                    '<div pns-library readonly="readonly" value="library.moreValue" ng-keyup="moreKeyUp()"  placeholder="搜索字段"></div>'+
                                '</div>'+
                                '<div class="moreTitle">'+
                                    '<label class="label">'+
                                        '<input type="checkbox" ng-click="moreChangeAll($event)">'+
                                        '<span style="font-weight: bold;" class="m-r-10">全选</span>'+
                                        '<span class="font-size:12px;color:#999;" class="m-l-10">已选择：</span>'+
                                        '<span class="theme-font-color" ng-bind="moreSelectSize"></span>'+
                                    '</label>'+
                                '</div>'+
                                '<ul class="moreList">'+
                                    '<li class="item" ng-show="item.filter" ng-repeat="item in modal_moreList">'+
                                        '<label class="label">'+
                                            '<input type="checkbox" ng-checked="item.show" ng-click="moreChange(item,$event)" class="m-r-10">'+
                                            '<span ng-bind="item.title"></span>'+
                                        '</label>'+
                                    '</li>'+
                                    '<li class="item" ng-repeat="item in modal_moreList_supple"></li>'+
                                '</ul>'+
                            '</div>'+
                            '<div class="modal-footer text-right">'+
                                '<button pns-submit class-name="layui-btn-sm search-btn" click="save()" value="保存"></button>'+
                                '<button pns-button class-name="layui-btn-sm layui-btn-primary" click="cancelModal()" value="取消"></button>'+
                            '</div>'+
                        '</div>' +
                  '</div>',
        link: function (scope, element, attr) {
            $rootScope.layPromise.then(function (layui) {

                scope.modal_id = "modal" + ((Math.random() + "").substring(3,10));

                scope.queryParams = {};

                scope.readonly = true;

                var keyName = scope.reqEntry;

                //表单参数
                scope.params = {};

                //高级搜索inputs
                scope.inputListKey = {}; //合并后的input key对象
                
                scope.inputList = []; //合并后input
                scope.otherList = []; //常用的条件
                scope.moreList = []; //更多筛选条件
                scope.showQuery = function () {
                    layui.layer.open({
                        title: "添加更多筛选条件",
                        type: 1,
                        shade: 0.3, //不显示遮罩
                        area: ["900px", "300px"],
                        content: $('#'+scope.modal_id),
                        success: function () {
                            $(".layui-layer.layui-layer-page").appendTo("body");
                            scope.modal_moreList = angular.copy(scope.moreList);
                            var size = scope.modal_moreList.length;
                                size = Math.ceil(size / 5);
                                size = size * 5 - scope.modal_moreList.length;
                             scope.modal_moreList_supple = [];  
                            for(var i=0; i < size; i++){
                                scope.modal_moreList_supple.push({})
                            }
                        }  
                    })
                }
                
                //更多筛选  input value
                scope.moreSelectSize = 0;
                scope.library = {
                    moreValue: ""
                }
                scope.moreKeyUp = function(){
                    if(!scope.library.moreValue){
                        scope.library.moreValue = "";
                    }
                    for(var i=0; i<scope.modal_moreList.length; i++){
                        if(scope.modal_moreList[i].title.indexOf(scope.library.moreValue) >= 0){
                            scope.modal_moreList[i].filter = true;
                        } else {
                            scope.modal_moreList[i].filter = false;
                        }
                    }
                }

                //更多条件 单选
                scope.moreChange = function(item,event){
                    item.show = event.target.checked;
                    scope.moreSelectSize = 0;
                    for(var i=0; i<scope.modal_moreList.length; i++){
                        if(scope.modal_moreList[i].show){
                            scope.moreSelectSize++;
                        }
                    }
                }

                //更多条件 全选
                scope.moreChangeAll = function(event){
                    for(var i=0; i<scope.modal_moreList.length; i++){
                        scope.modal_moreList[i].show = event.target.checked;
                    }
                    if(event.target.checked){
                        scope.moreSelectSize = scope.modal_moreList.length;
                    } else {
                        scope.modal_moreList = 0;
                    }
                }

                //保存
                scope.save = function(){
                    scope.moreList = [];
                    for(var i=0; i<scope.modal_moreList.length; i++){
                        scope.moreList.push(scope.modal_moreList[i]);
                    }
                    scope.$apply();
                    layui.layer.closeAll();
                }

                //取消
                scope.cancelModal = function(){
                    layui.layer.closeAll();
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

                scope.menuFilter = function(data){

                    //高级搜索inputs
                    scope.inputListKey = {}; //合并后的input key对象
                                
                    scope.inputList = []; //合并后input
                    scope.otherList = []; //常用的条件
                    scope.moreList = []; //更多筛选条件

                    var result = data;
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
                    var otherList = [];
                    for(var i=0; i<result.length; i++){
                        //合并Input
                        if(result[i].type == "Input"){
                            scope.inputKeyFist = result[i].code;
                            scope.labelTitle = result[i].title;
                            scope.inputList.push(result[i]);
                            scope.inputListKey[result[i].code] = "";
                        } else {
                            otherList.push(result[i]);
                        }
                    }
                    for(var i=0; i < otherList.length; i++){
                        otherList[i].filter = true;
                        //合并Input
                        if( i < 3){
                            scope.otherList.push(otherList[i]);
                        } else {
                            scope.moreList.push(otherList[i]);
                        }
                    }
                }

                scope.getHightSearch = function(){
                    var hightSearchList = sessionFactory.get(keyName);

                    if(hightSearchList){
                        hightSearchList = JSON.parse(hightSearchList);
                        scope.menuFilter(hightSearchList);
                    } else {
                        httpService.request({
                            method: "get",
                            url: "/searchPanel/hightSearchList",
                            isKey: false,
                            isToken: true,
                            data: {
                                reqEntry: scope.reqEntry
                            },
                            root: scope.root
                        }).then(function (res) {
                            if (res.code == 200) {
                                scope.menuFilter(res.data);
                                sessionFactory.put(keyName,JSON.stringify(res.data));
                            }
                        })
                    }
                }

                scope.$watch("symbol",function(val){
                    if(val > 0){
                        scope.getHightSearch();
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
            })
        }

    };
}