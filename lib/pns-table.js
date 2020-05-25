export default function(httpService,$rootScope){
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
            cloumn: "=?" //自定义列
        },
        template: '<div class="table-box">'+
                    '<table class="pns-table table">' +
                        '<thead class="thead">'+
                            '<tr class="tr">'+
                                '<th class="th" style="width:50px">'+
                                    '<div class="title">序号</div>'+
                                '</th>'+
                                '<th class="th" ng-repeat="item in cols" ng-style="{width:item.width}">'+
                                    '<div class="title" ng-if="item.isType==\'checkbox\'">'+
                                        '<input type="checkbox" ng-model="checkAll" ng-click="item.checkAll(item)" ng-if="item.isCheckAll">'+
                                    '</div>'+
                                    '<div class="title" ng-if="item.isType==\'href\'" ng-bind="item.title"></div>' +
                                    '<div class="title" ng-if="item.isType==\'button\'">操作</div>' +
                                    '<div class="title" ng-if="item.isType==\'select\'" ng-bind="item.title"></div>' +
                                    '<div class="title" ng-if="!item.isType" ng-bind="item.title" ></div>' +
                                '</th>'+
                            '</tr>'+
                        '</thead>' +
                        '<tbody class="tbody">' +
                            '<tr class="tr" ng-if="!list || list.length==0"><td class="td text-center" colspan="{{cols.length+1}}">暂无数据</td></tr>' +
                            '<tr class="tr" ng-if="list && list.length > 0" ng-repeat="item in list">' +
                                '<td class="td">'+
                                    '<div class="title" ng-bind="page>1 ? ($index+1 > 9 ? page : page-1) +\'\'+($index+1 > 9 ? 0 : $index+1) : page+$index"></div>'+
                                '</td>'+
                                '<td class="td" ng-repeat="key in cols track by $index">' +
                                    '<div class="title" ng-if="key.isType==\'checkbox\'"> <div style="margin:auto;width:13px;line-height:13px" ng-click="key.change(item)"> <input type="checkbox" ng-model="item.status" > </div> </div>' +
                                    '<div class="title" ng-if="key.isType==\'href\'" ng-class="setClass(key.isClass,item,key.code)" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'select\'" pns-select disabled="item.disabled" list="key.list" key="item[key.code]" value-name="key" title-name="value"  ng-click="key.click(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'style\'" ng-class="{}" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'button\'">'+
                                        '<span ng-repeat="btn in key.buttons" >'+
                                            '<button pns-file ng-if="btn.type == \'pns-file\'" url="btn.url" params="btn.params" callback="btn.click(result,item)" accept="{{btn.accept}}" value="{{btn.value}}"></button>' +
                                            '<button pns-button ng-if="!btn.type" class="layui-btn-xs {{btn.className}}" value="{{btn.value}}" click="btn.click(item)"></button>' +
                                        '</span>'+
                                    '</div>' +
                                    '<div class="title" ng-if="!key.isType">'+
                                        '<span ng-if="!key.dataMap" title="{{item[key.code]}}" ng-bind="item[key.code].length > 20 ? item[key.code].substring(0,15)+\'...\':item[key.code]"></span>' +
                                        '<span ng-if="key.dataMap"  title="{{key.dataMap[item[key.code]]}}" ng-bind="key.dataMap[item[key.code]]"></span>' +
                                    '</div>'+
                                '</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>'+
                  '</div>',
        link: function (scope, element, attr) {
            scope.setClass = function(classList,item,code){
                var className = "";
                if (classList){
                    for (var i = 0; i < classList.length; i++) {
                        var codeName = classList[i].where[0];
                        var value = classList[i].where[2];
                        var symbol = classList[i].where[1];
                        if (symbol == ">=") {
                            if (item[codeName] >= value) {
                                className = classList[i].className;
                            }
                        } else if (symbol == "<=") {
                            if (item[codeName] <= value) {
                                className = classList[i].className;
                            }
                        } else if (symbol == "==") {
                            if (item[codeName] == value) {
                                className = classList[i].className;
                            }
                        } else if (symbol == "!=") {
                            if (item[codeName] != value) {
                                className = classList[i].className;
                            }
                        } else if (symbol == ">") {
                            if (item[codeName] > value) {
                                className = classList[i].className;
                            }
                        } else if (symbol == "<") {
                            if (item[codeName] != value) {
                                className = classList[i].className;
                            }
                        }
                    }
                }
                
                return className;
            }
        
            scope.getCloumn = function(list){
                httpService.request({
                    method: "get",
                    url: "/searchPanel/selectCloumnList",
                    isKey: false,
                    isToken: true,
                    data: {
                        resEntry: scope.resEntry
                    },
                    root: $rootScope.rootName
                }).then(function (res) {
                    if (res.code == 200) {
                        var cols = res.data;
                        scope.header = angular.copy(res.data);
                        scope.headerCloumn = res.data;
                        if (scope.cloumn && scope.cloumn.length > 0){
                            for(var i=0; i<scope.cloumn.length; i++){
                                if (scope.cloumn[i].isType == "checkbox"){
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
                            if(cols[i].width){
                                if(cols[i].width.indexOf("px") < 0){
                                    cols[i].width = cols[i].width + "px";
                                }
                            } else {
                                cols[i].width = "50px";
                            }
                        }
                        scope.cols = cols;
                    }
                })
            }

            scope.$watch("header",function(val){
                if(val){
                    scope.cols = scope.headerCloumn;
                }
            })
            scope.$watch("cloumn",function(val){
                if(val){
                    scope.getCloumn();
                }
            })

        }
    };

} 
