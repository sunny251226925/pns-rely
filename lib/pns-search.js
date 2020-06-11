module.exports = function($rootScope, httpService, sessionFactory, $location,$compile){
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
                                            '<div ng-if="item.type == \'Radio\'" pns-search-radio list="item.data" parent-key="parentKey" cascade="item.childDictTypeId" key="params[item.code]" change="multipleListChange(item,cascade)"></div>' +
                                            '<div ng-if="item.type == \'SelectSearch\'" pns-select-search list="item.data" key="params[item.code]" value-name="key" title-name="value"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && item.letterDisplay" pns-search-abc list="item.data" key="params[item.code]"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && !item.letterDisplay" pns-search-checkbox list="item.data" key="params[item.code]" parent-key="parentKey" cascade="item.childDictTypeId" change="multipleListChange(item,cascade)"></div>' +
                                            '<div ng-if="item.type == \'DateRange\'" pns-date range="range" key="params[item.code]"></div>' +
                                        '</td>' +
                                    '</tr>' +
                                    '<tr ng-repeat="item in moreList" ng-if="item.show">' +
                                        '<td class="search-label" ng-class="{\'line20\':item.title.length>6}" ng-bind="item.title+\'：\'"></td>' +
                                        '<td class="search-content">' +
                                            '<div ng-if="item.type == \'Select\'" pns-select list="item.data" parent-key="parentKey" cascade="item.childDictTypeId" key="params[item.code]" value-name="key" title-name="value" change="selectChange(item,cascade)"></div>' +
                                            '<div ng-if="item.type == \'Radio\'" pns-search-radio list="item.data" parent-key="parentKey" cascade="item.childDictTypeId" key="params[item.code]" change="multipleListChange(item,cascade)"></div>' +
                                            '<div ng-if="item.type == \'SelectSearch\'" pns-select-search list="item.data" key="params[item.code]" value-name="key" title-name="value"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && item.letterDisplay" pns-search-abc list="item.data" key="params[item.code]"></div>' +
                                            '<div ng-if="item.type == \'MultipleList\' && !item.letterDisplay" pns-search-checkbox list="item.data" key="params[item.code]" parent-key="parentKey" cascade="item.childDictTypeId" change="multipleListChange(item,cascade)"></div>' +
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
                  '</div>',
        link: function (scope, element, attr) {
            $rootScope.layPromise.then(function (layui) {

                var modal_id = "modal" + ((Math.random() + "").substring(3,10));
                var checkboxAll = "#" + modal_id +" .checkboxAll";
                var checkboxChange = "#" + modal_id +" .checkboxChange";

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
                var layerIndex = "";

                var modal_moreList = [];
                var modal_moreList_supple = [];
                scope.showQuery = function () {
                    modal_moreList = angular.copy(scope.moreList);
                    var size = modal_moreList.length;
                        size = Math.ceil(size / 5);
                        size = size * 5 - modal_moreList.length;
                     modal_moreList_supple = [];  
                    for(var i=0; i < size; i++){
                        modal_moreList_supple.push({})
                    }

                    console.log("modal_moreList",modal_moreList)

                    var html = '<div class="modal" id="'+modal_id+'" style="display:block;">';
                        html += '<div class="modal-content">'+
                                    // '<div class="pns-library" style="width:290px; height:28px;">'+
                                    //     '<input type="text" ng-model="value" class="pns-input moreKeyUpClass" placeholder="搜索字段" class="pns-input" />'+
                                    //     '<i class="iconfont iconicons_search_home"></i>'+
                                    // '</div>'+
                                    '<div class="moreTitle">'+
                                        '<label class="label">'+
                                            '<input type="checkbox" class="checkboxAll">'+
                                            '<span style="font-weight: bold;" class="m-r-10" >全选</span>'+
                                            '<span class="font-size:12px;color:#999;" class="m-l-10">已选择：</span>'+
                                            '<span class="theme-font-color moreSelectSize"></span>'+
                                        '</label>'+
                                    '</div>'+
                                    '<ul class="moreList">';
                        for(var i=0; i<modal_moreList.length; i++){
                        html +=         '<li class="item" ng-show="item.filter" ng-repeat="item in modal_moreList">'+
                                            '<label class="label">';
                                        if(modal_moreList[i].checked){
                        html +=                 '<input type="checkbox" checked="checked" data-id="'+modal_moreList[i].code+'" class="m-r-10 checkboxChange">';
                                        } else {
                        html +=                 '<input type="checkbox" data-id="'+modal_moreList[i].code+'" class="m-r-10 checkboxChange">';
                                        }
                        html +=                 '<span>'+modal_moreList[i].title+'</span>';
                        html +=             '</label>';
                        html +=          '</li>';
                        }
                        for(var i=0; i<modal_moreList_supple.length; i++){   
                            html +=     '<li class="item" ng-repeat="item in modal_moreList_supple"></li>';
                        }  
                        html +=       '</ul>';
                        html +=   '</div>'; 
                        html += '<div class="modal-footer text-right">'+
                                    '<button class="layui-btn layui-btn-sm search-btn checkedSave">保存</button>'+
                                    '<button class="layui-btn layui-btn-sm layui-btn-primary checkedCancel">取消</button>'+
                                '</div>';        
                        html += '</div>';
                    layerIndex = layui.layer.open({
                        title: "添加更多筛选条件",
                        type: 1,
                        shade: 0.3, //不显示遮罩
                        area: ["900px", "360px"],
                        content: html,
                        success: function () {
                            var size = $("body .modal .checkboxChange:checked").length;
                            $("body .moreSelectSize").text(size);
                            if(modal_moreList.length == size){
                                $(checkboxAll).prop("checked",true);
                            } else {
                                $(checkboxAll).prop("checked",false);
                            }
                        }  
                    })
                }
                
                //更多筛选  input value
                scope.library = {
                    moreValue: ""
                }

                $("body").on("keyup",".moreKeyUpClass",function(event){
                    var value = event.target.value;
                    for(var i=0; i<modal_moreList.length; i++){
                        if(modal_moreList[i].title.indexOf(value) >= 0){
                            modal_moreList[i].filter = true;
                        } else {
                            modal_moreList[i].filter = false;
                        }
                    }
                })

                //更多条件 单选
                $("body").on("click","#"+modal_id+" .checkboxChange",function(event){
                    var checked = event.target.checked;
                    var size = $("body .modal .checkboxChange:checked").length;
                    $("body .moreSelectSize").text(size);
                    if(!checked){
                        $("body .modal .checkboxAll").prop("checked",false);
                    }
                })

                //更多条件 全选
                $(document).on("change","#"+modal_id+" .checkboxAll",function(event){
                    $(checkboxChange).prop("checked",event.target.checked)
                    var size = $("body #"+modal_id+" .checkboxChange:checked").length;
                    $("body .moreSelectSize").text(size);
                })

                //保存
                $(document).on("click","#"+modal_id+" .checkedSave", function(){
                    scope.moreList = [];
                    // var code = "";
                    // for(var i=0; i<modal_moreList.length; i++){
                    //     code = modal_moreList[i].code;
                    //     scope.params[code] = "";
                    //     scope.moreList.push(modal_moreList[i]);
                    // }
                    var domList = $("body .modal .checkboxChange:checked");                    
                    var checkList = [];
                    for(var i=0; i<domList.length; i++){
                        checkList.push($(domList[i]).attr("data-id"))
                    }

                    var notChecked = $("body .modal .checkboxChange:not(:checked)");
                    var notList = [];
                    for(var i=0; i<notChecked.length; i++){
                        notList.push($(notChecked[i]).attr("data-id"))
                    }

                    var list = JSON.parse(sessionFactory.get(keyName));
                    if(checkList.length > 0){
                        for(var i=0; i<list.length; i++){
                            if(checkList.indexOf(list[i].code) >= 0){
                                list[i].checked = true;
                                list[i].show = true;
                                scope.moreList.push(list[i]);
                            }
                        }
                    } 
                    if(notList.length > 0){
                        for(var i=0; i<list.length; i++){
                            if(notList.indexOf(list[i].code) >= 0){
                                list[i].checked = false;
                                list[i].show = false;
                                scope.moreList.push(list[i]);
                            }
                        }
                    }
                    
                    scope.$apply();
                    if(layerIndex){
                        layui.layer.close(layerIndex);
                    } else {
                        layui.layer.closeAll();
                    }
                })

                //取消
                $(document).on("click",".modal .checkedCancel", function(){
                    if(layerIndex){
                        layui.layer.close(layerIndex);
                    } else {
                        layui.layer.closeAll();
                    }
                })

                //MultipleList级联选中回调
                scope.multipleListChange = function(item,cascade){
                    console.log(item,cascade,"22222")
                    if(cascade){
                        var cascadeArray = cascade.split(",");
                        for(var i=0; i<cascadeArray.length; i++){
                            scope.params[cascadeArray[i]] = "";
                        }

                        for(var i=0; i<scope.otherList.length; i++){
                            if(cascadeArray.indexOf(scope.otherList[i].code) >= 0){
                                for(var j=0; j<scope.otherList[i].data.length; j++){
                                    console.log(scope.otherList[j].data[j].parentCode,item.key)
                                    if(scope.otherList[i].data[j].parentCode == item.key){
                                        scope.otherList[i].data[j].codeShow = true;
                                    } else {
                                        scope.otherList[i].data[j].codeShow = false;
                                    }
                                }
                            }
                        }
                        for(var i=0; i<scope.moreList.length; i++){
                            if(cascadeArray.indexOf(scope.moreList[i].code) >= 0){
                                for(var j=0; j<scope.moreList[i].data.length; j++){
                                    // console.log(scope.moreList[i].data[j].parentCode,item.key)
                                    if(scope.moreList[i].data[j].parentCode){
                                        if(scope.moreList[i].data[j].parentCode == item.key){
                                            scope.moreList[i].data[j].codeShow = true;
                                            console.log("true",scope.moreList[i].data[j])
                                        } else {
                                            scope.moreList[i].data[j].codeShow = false;
                                            console.log("false",scope.moreList[i].data[j])
                                        }
                                    }
                                }
                            }
                        }
                        console.log(cascadeArray,scope.moreList,scope.moreList)
                    }
                    
                }

                //select级联选中回调
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
                    for(var key in scope.queryParams){
                        if(scope.queryParams[key] == "null"){
                            scope.queryParams[key] = "";
                        }
                        if(scope.queryParams[key] == "[]"){
                            scope.queryParams[key] = [];
                        }
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