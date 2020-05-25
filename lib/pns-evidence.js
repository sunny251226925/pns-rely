module.exports = function($http, sessionFactory){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            type: "@",  //佐证材料类型
            show: "=", //是否显示打印页面
            code: "=?", //户号
            reason: "=?", //原因
            resEntry: "@?", //表头接口请求参数
            list: "=?",  //列表list
        },
        template: '<div id="pns-evidence" class="pns-evidence" ng-show="show">'+
                        '<div class="temp print-box">' +
                            '<div class="title print-hide">'+
                                '<span ng-bind="title"></span>'+
                                '<span pns-button class-name="search-btn right" click="closePrint()" value="关闭打印页"></span>' +
                            '</div>' +
                            '<div class="title-min">证明</div>' +
                            '<div>'+
                                '<span type="text" class="input w100" ng-bind="code" readonly></span>'+
                                '<span>分中心</span>'+
                            '</div>' +

                            '<div class="content" ng-if="type==1">'+
                                '<span class="pl-line">户号为</span>'+
                                '<span class="input w300" ng-bind="reason" ></span>'+
                                '<span>等的用户因窃电原因，无法及时进行表计退旧。</span>'+
                                '<p class="pl-line">特此证明。</p>'+
                                '<p class="text-right">稽查负责人签字：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +
                            
                            '<div class="content" ng-if="type==2">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因拆迁原因，表计在拆迁现场遗失，无法退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任：</p>' +
                                '<p class="text-right">营销部主任：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==3">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因存在纠纷，需留存本地库房，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==5">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因现场无法拆除，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">施工队负责人/现场施工人员：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==7">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因虚拟户现场无表，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                                '<p class="text-right">营销部主任：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==8">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因用电现场失窃，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">用户：</p>' +
                                '<p class="text-right">现场施工人员/施工队负责人：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==9">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因保管丢失无表，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">现场施工人员/施工队负责人：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==10">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因自购资产，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==11">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因垃圾户销户，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">供电分中心用户档案管理人员/分中心主任/所长/计量主任签字：</p>' +
                                '<p class="text-right">营销部主任：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==12">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因计量装置烧毁(用户原因)，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">用户：</p>' +
                                '<p class="text-right">现场施工人员/施工队负责人：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==13">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因计量装置烧毁(非用户原因)，无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">现场施工人员/施工队负责人：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="content" ng-if="type==14">' +
                                '<span class="pl-line">户号为</span>' +
                                '<input type="text" class="input w300" readonly>' +
                                '<span>等的用户因验表原因， 无法及时进行表计退旧。</span>' +
                                '<p class="pl-line">特此证明。</p>' +
                                '<p class="text-right">现场施工人员签字：</p>' +
                                '<p class="text-right">供电分中心施工管理人员/分中心主任/所长/计量主任签字：</p>' +
                            '</div>' +

                            '<div class="seal">' +
                                '<p class="text-right pl-right">分中心盖章</p>' +
                                '<p class="text-right">（后附详细表号明细）</p>' +
                            '</div>' +

                            '<div class="text-right"><div pns-printing target-id="pns-evidence" class="search-btn print-hide" value="打印"></div></div>' +

                            '<div pns-table res-entry="{{resEntry}}" list="tableList" cloumn="1" page="1"></div>'+
                        '</div>' +
                  '</div>',
        link: function (scope, element, attr) {
           
            scope.tableList = [];
            scope.$watch("list",function(val){
                if(val){
                    scope.tableList = val;
                }
            })
        
            scope.closePrint = function(){
                scope.show = false;
            }
            
            var typeName = [
                "窃电未回", 
                "拆迁无表", 
                "纠纷留存", 
                "",
                "现场无法拆除",
                "",
                "虚拟户现场无表",
                "用电现场失窃",
                "保管丢失",
                "自购资产",
                "垃圾户销户",
                "计量装置烧毁（用户原因）",
                "计量装置烧毁（非用户原因）",
                "验表未回"
            ];

            scope.title = typeName[scope.type-1];

            $(".pns-evidence").appendTo("body");
        }
    };
}