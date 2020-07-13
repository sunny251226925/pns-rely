module.exports = function(httpService, sessionFactory, $location){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            resEntry: "@", //表头接口请求参数
            page: "=", //当前页码
            list: "=",  //列表list
            header: "=?", //列表表头list
            checkAll: "=?", //全选按钮的状态
            root: "=", //库名
            symbol: "=", //触发请求的开关   0：关闭    >0:打开
            cloumn: "=?" //自定义列
        },
        template: '<div class="table-box">'+
                    '<div class="operation">'+
                        '<i class="iconfont iconicon_table_listset" title="自定义列" ng-click="autoCloumnOpen($event)"></i>'+
                    '</div>'+
                    '<ul class="autoCloumn" ng-class="{true:\'open\',false:\'close\'}" ng-style="autoCloumnStyle" ng-blur="autoCloumnBlur()" ng-show="autoCloumnShow" tabindex="1" id="{{autoCloumnId}}">'+
                        '<li class="item">'+
                            '<label class="label">'+
                                '<input type="checkbox" class="checkboxAll" ng-mousedown="autoCloumnChangeAll($event,item)">'+
                                '<span>全选</span>'+
                            '</label>'+
                        '</li>'+
                        '<li class="item" ng-repeat="item in autoCloumnList" ng-if="item.isType!=\'checkbox\'" ng-hide="$index==(autoCloumnList.length-1)"'+
                            '<label class="label">'+
                                '<input type="checkbox" class="checkboxChange" ng-mousedown="autoCloumnChange($event,item)">'+
                                '<span ng-bind="item.title"></span>'+
                            '</label>'+
                        '</li>'+
                    '</ul>'+
                    '<div class="frame">'+
                        '<table class="pns-table table">' +
                            '<thead class="thead">'+
                                '<tr class="tr">'+
                                    '<th class="th" style="width:50px">'+
                                        '<div class="title">序号</div>'+
                                    '</th>'+
                                    '<th class="th" ng-show="item.checked" ng-repeat="item in cols track by $index" ng-style="{width:item.width}">'+
                                        '<div class="title" ng-show="item.isType==\'checkbox\'">'+
                                            '<input type="checkbox" ng-checked="checkAll" ng-click="checkChangeAll()">'+
                                        '</div>'+
                                        '<div class="title" ng-show="item.isType==\'radio\'">'+'</div>'+
                                        '<div class="title" ng-show="item.isType==\'href\'" ng-bind="item.title"></div>' +
                                        '<div class="title" ng-show="item.isType==\'button\'" ng-bind="item.title ? item.title : \'操作\'"></div>' +
                                        '<div class="title" ng-show="item.isType==\'select\'" ng-bind="item.title"></div>' +
                                        '<div class="title" ng-show="!item.isType" ng-bind="item.title" ></div>' +
                                    '</th>'+
                                '</tr>'+
                            '</thead>' +
                            '<tbody class="tbody">' +
                                '<tr class="tr" ng-show="!tableList || tableList.length==0"><td class="td text-center" style="height:280px" colspan="{{cols.length+1}}">暂无数据</td></tr>' +
                                '<tr class="tr" ng-show="tableList && tableList.length > 0" ng-repeat="item in tableList">' +
                                    '<td class="td" style="width:50px">'+
                                        '<div class="title" ng-bind="getPageNumber()[$index]"></div>'+
                                    '</td>'+
                                    '<td class="td" ng-show="key.checked" ng-repeat="key in cols track by $index">' +
                                        '<div class="title" ng-show="key.isType==\'checkbox\'"> <div style="margin:auto;width:13px;line-height:13px" ng-click="checkboxChange(item,key)"> <input type="checkbox" ng-checked="item.status" > </div> </div>' +
                                        '<div class="title" ng-show="key.isType==\'radio\'"> <div style="margin:auto;width:13px;line-height:13px" ng-click="radioChange(item,key)"> <input type="checkbox" ng-checked="item.status" > </div> </div>' +
                                        '<div class="title" ng-show="key.isType==\'href\'" ng-class="setClass(key.isClass,item,key.code)" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                        '<div class="title" ng-show="key.isType==\'select\'" pns-select disabled="item.disabled" list="key.list" key="item[key.code]" value-name="key" title-name="value"  ng-click="key.click(item)"></div>' +
                                        '<div class="title" ng-show="key.isType==\'style\'" ng-class="{}" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                        '<div class="title" ng-show="key.isType==\'button\'">'+
                                            '<span ng-repeat="btn in key.buttons" >'+
                                                '<button pns-file ng-show="btn.type == \'pns-file\'" url="btn.url" params="btn.params" callback="btn.click(result,item)" accept="{{btn.accept}}" value="{{btn.value}}"></button>' +
                                                '<button pns-button ng-show="!btn.type" class="layui-btn-xs {{btn.className}}" value="{{btn.value}}" click="btn.click(item)"></button>' +
                                            '</span>'+
                                        '</div>' +
                                        '<div class="title" ng-show="!key.isType">'+
                                            '<span ng-show="!key.dataMap" title="{{item[key.code]}}" ng-bind="item[key.code].length > 23 ? item[key.code].substring(0,15)+\'...\':item[key.code]"></span>' +
                                            '<span ng-show="key.dataMap"  title="{{key.dataMap[item[key.code]]}}" ng-bind="key.dataMap[item[key.code]]"></span>' +
                                        '</div>'+
                                    '</td>' +
                                '</tr>' +
                            '</tbody>'+
                        '</table>'+
                    '</div>'+
                '</div>',
        link: function (scope, element, attr) {

            //多选选中事件
            scope.checkboxChange = function(item,key){
                item.status = !item.status;
                let selectSize = 0;
                scope.list.forEach( (value) => {
                    if(value.status){
                        selectSize++;
                    }
                })
                if(selectSize == scope.list.length){
                    scope.checkAll = true;
                } else {
                    scope.checkAll = false;
                }
                key.change(item);
            }

            //多选全选事件
            scope.checkChangeAll = function(){
                scope.checkAll = !scope.checkAll;
                scope.list.forEach( (value) => {
                    value.status = scope.checkAll;
                })
            }

            //单选选中事件
            scope.radioChange = function(item,key){
                scope.list.forEach( (value) => {
                    if(item.$$hashKey == value.$$hashKey){
                        value.status = !value.status;
                    } else {
                        value.status = false;
                    }
                })
                key.change(item);
            }

            scope.getPageNumber = function(){
                var numberList = [];
                if(scope.page instanceof Object){
                    var pageSize = scope.page.page * scope.page.size;
                    for(var i=1; i<=scope.page.size; i++){
                        pageSize--
                        numberList.push(pageSize);
                    }
                    for(var i=0; i<numberList.length; i++){
                        numberList[i] += 1;
                    }
                } else {
                    var pageSize = scope.page * scope.list.length;
                    for(var i=1; i<=scope.list.length; i++){
                        pageSize--
                        numberList.push(pageSize);
                    }
                    for(var i=0; i<numberList.length; i++){
                        numberList[i] += 1;
                    }
                }
           
                numberList.reverse();
                return numberList;
            }

            scope.setClass = function(classList,item,code){
                var className = "";
                if (classList){
                    for (var i = 0; i < classList.length; i++) {
                        if(classList[i]){
                            var codeName = classList[i].where[0];
                            var value = classList[i].where[2];
                            var symbol = classList[i].where[1];
                            if (symbol == ">=") {
                                if (item[codeName] >= value) {
                                    className += classList[i].className + " ";
                                }
                            } else if (symbol == "<=") {
                                if (item[codeName] <= value) {
                                    className += classList[i].className + " ";
                                }
                            } else if (symbol == "==") {
                                if (item[codeName] == value) {
                                    className += classList[i].className + " ";
                                }
                            } else if (symbol == "!=") {
                                if (item[codeName] != value) {
                                    className += classList[i].className + " ";
                                }
                            } else if (symbol == ">") {
                                if (item[codeName] > value) {
                                    className += classList[i].className + " ";
                                }
                            } else if (symbol == "<") {
                                if (item[codeName] != value) {
                                    className += classList[i].className + " ";
                                }
                            }
                        }
                    }
                }
                
                return className;
            }
    

            //自定义列-id
            scope.autoCloumnId = "autoCloumn" + (( Math.random() + "").substring(3,10));
            //自定义列-状态
            scope.autoCloumnShow = false;
            //自定义列-打开
            scope.autoCloumnOpen = function(event){
                var x = $(event.target).offset().left;
                var y = $(event.target).offset().top;
                if( y > 280 ){
                    scope.autoCloumnStyle = {
                        top: y - 280 +  "px",
                        left: x - 120 + "px"
                    }
                } else {
                    scope.autoCloumnStyle = {
                        top: y + 35 +  "px",
                        left: x - 120 + "px"
                    }
                }
               
                scope.autoCloumnShow = true;
                scope.autoCloumnList = angular.copy(scope.cols);
                var falseSize = 0;
                var isCheckbox = false;
                setTimeout(function(){
                    $("#"+scope.autoCloumnId).focus();
                    for(var i=0;i<scope.autoCloumnList.length; i++){
                        if(i==0 && scope.autoCloumnList[i].isType == "checkbox"){
                            isCheckbox = true;
                        }
                        if(scope.autoCloumnList[i].code){
                            $("#"+scope.autoCloumnId+" .checkboxChange[type=checkbox]").eq( isCheckbox?i-1:i).prop("checked", scope.autoCloumnList[i].checked);
                            if(!scope.autoCloumnList[i].checked){
                                falseSize++
                            }
                        }
                    }
                    if(falseSize > 0){
                        $("#"+scope.autoCloumnId+" .checkboxAll").prop("checked", false);
                    } else {
                        $("#"+scope.autoCloumnId+" .checkboxAll").prop("checked", true);
                    }
                },200)
            }
            //自定义列-全选
            scope.autoCloumnChangeAll = function(event){
                scope.autoCloumnShow = true;
                for(var i=0; i<scope.autoCloumnList.length; i++){
                    scope.autoCloumnList[i].checked = !event.target.checked;
                    if(scope.autoCloumnList[i].code){
                        $("#"+scope.autoCloumnId+" .checkboxChange").prop("checked", scope.autoCloumnList[i].checked); 
                    }
                }
                event.preventDefault();
            }
            //自定义列-单选
            scope.autoCloumnChange = function(event,item){
                scope.autoCloumnShow = true;
                item.checked = !event.target.checked;
                if(!item.checked){
                    $("#"+scope.autoCloumnId+" .checkboxAll").prop("checked", false);
                }
                event.preventDefault();
            }
            //自定义列-焦点失去
            scope.autoCloumnBlur = function(){
                scope.autoCloumnShow = false;
                scope.cols = scope.autoCloumnList;
            }

            //列过滤
            scope.cloumnFilter = function(cols){
                scope.header = angular.copy(cols);
                scope.headerCloumn = cols;
                if (scope.cloumn && scope.cloumn.length > 0){
                    for(var i=0; i<scope.cloumn.length; i++){
                        if (scope.cloumn[i].isType == "checkbox"){
                            cols.unshift(scope.cloumn[i]);
                        }
                        if (scope.cloumn[i].isType == "radio"){
                            cols.unshift(scope.cloumn[i]);
                        }
                        if (scope.cloumn[i].isType == "button"){
                            cols.push(scope.cloumn[i]);
                        }
                        if (scope.cloumn[i].isType == "href"){
                            for(var j=0; j<cols.length; j++){
                                if (cols[j].code == scope.cloumn[i].isCode){
                                    for (var key in scope.cloumn[i]){
                                        cols[j][key] = scope.cloumn[i][key];
                                    }
                                }
                            }
                        }
                        if (scope.cloumn[i].isType == "select"){
                            for(var j=0; j<cols.length; j++){
                                if (cols[j].code == scope.cloumn[i].isCode){
                                    for (var key in scope.cloumn[i]){
                                        cols[j][key] = scope.cloumn[i][key];
                                    }
                                }
                            }
                        }
                    }
                }
                for(var i=0; i<cols.length; i++){
                    cols[i].checked = true;
                    if(cols[i].width){
                        if(cols[i].width.indexOf("px") < 0){
                            cols[i].width = cols[i].width + "px";
                        }
                    } else {
                        cols[i].width = "50px";
                    }
                }
                scope.cols = cols;
                scope.selectCloumnList = cols;
            }


            //获取动态列
            scope.getSelectCloumnList = function(){
                httpService.request({
                    method: "get",
                    url: "/searchPanel/selectCloumnList",
                    isKey: false,
                    isToken: true,
                    data: {
                        resEntry: scope.resEntry
                    },
                    root: scope.root
                }).then(function (res) {
                    if (res.code == 200) {
                        scope.$watch("cloumn",function(){
                            scope.cloumnFilter(res.data);
                        })
                    }
                })
            }

            scope.$watch("header",function(val){
                if(val){
                    scope.cols = scope.headerCloumn;
                }
            })

            scope.$watch("symbol",function(val){
                if(val > 0 ){
                    scope.getSelectCloumnList();
                }
            })

            scope.tableList = [];
            scope.$watch("list",function(val){
                if(val && val.length > 0){
                    val.forEach( (item) => {
                        item.status = false;
                    })
                }
                scope.tableList = val;
            })
            
        }
    };

} 
