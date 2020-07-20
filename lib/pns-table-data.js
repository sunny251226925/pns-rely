module.exports = function(){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            header: "=?", //列表表头list
            list: "=",  //列表list
            page: "=?" //当前页码
        },
        template: '<div class="table-box">'+
                    '<table class="pns-table table">' +
                        '<thead class="thead">'+
                            '<tr class="tr">'+
                                '<th class="th">'+
                                    '<div class="title">序号</div>'+
                                '</th>'+
                                '<th class="th" ng-repeat="item in header" ng-style="{width: item.width}" ng-class="{\'width-min\':item.isType==\'checkbox\'}">'+
                                    '<div class="title" ng-if="item.isType==\'checkbox\'">'+
                                        '<input type="checkbox" ng-checked="checkAll" ng-click="checkChangeAll()" >'+
                                    '</div>'+
                                    '<div class="title" ng-if="item.isType==\'radio\'">'+'</div>'+
                                    '<div class="title" ng-if="item.isType==\'href\'" ng-bind="item.title"></div>' +
                                    '<div class="title" ng-if="item.isType==\'button\'" >操作</div>' +
                                    '<div class="title" ng-if="item.isType==\'select\'" ng-bind="item.title"></div>' +
                                    '<div class="title" ng-if="!item.isType" ng-style="{width:item.width+\'px\'}" ng-bind="item.title" ></div>' +
                                '</th>'+
                            '</tr>' +
                        '</thead>' +
                        '<tbody class="tbody">' +
                            '<tr class="tr" ng-repeat="item in list">' +
                                '<td class="td" style="width:50px">'+
                                    '<div class="title" ng-bind="getPageNumber()[$index]"></div>'+
                                '</td>'+
                                '<td class="td" ng-repeat="key in header track by $index">' +
                                    '<div class="title" ng-if="key.isType==\'checkbox\'" style="width:50px" ng-click="checkboxChange(item,key)"><input type="checkbox" ng-checked="item.status"></div>' +
                                    '<div class="title" ng-if="key.isType==\'radio\'"  style="width:50px" ng-click="radioChange(item,key)"> <input type="checkbox" ng-checked="item.status" ></div>' +
                                    '<div class="title" ng-if="key.isType==\'href\'" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'select\'" pns-select disabled="item.disabled" list="key.list" key="item[key.code]" value-name="key" title-name="value" change="key.change(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'style\'" ng-class="{}" ng-bind="item[key.code]" ng-click="key.click(item)"></div>' +
                                    '<div class="title" ng-if="key.isType==\'button\'">'+
                                        '<span ng-repeat="btn in key.buttons" >'+
                                            '<button pns-file ng-if="btn.type == \'pns-file\'" url="btn.url" params="btn.params" callback="btn.click(result,item)" accept="{{btn.accept}}" value="{{btn.value}}"></button>' +
                                            '<button pns-button ng-if="!btn.type" class="layui-btn-xs {{btn.className}}" value="{{btn.value}}" click="btn.click(item)"></button>' +
                                        '</span>'+
                                    '</div>' +
                                    '<div class="title" ng-if="!key.isType">'+
                                        '<span ng-if="!key.dataMap" title="{{item[key.code]}}" ng-bind="item[key.code].length > 20 ? item[key.code].substring(0,15)+\'...\':item[key.code]" ng-style="{width:key.width+\'px\'}"></span>' +
                                        '<span ng-if="key.dataMap"  title="{{key.dataMap[item[key.code]]}}" ng-bind="key.dataMap[item[key.code]]" ng-style="{width:key.width+\'px\'}"></span>' +
                                    '</div>'+
                                '</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>'+
                  '</div>',
        link: function (scope) {

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
            
            //多选选中事件
            scope.checkboxChange = function(item,key){
                item.status = !item.status;
                var selectSize = 0;
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
        }
    };
}