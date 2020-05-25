module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            total: "=", //总条数
            page: "=", //当前页数
            event: "&?" //查询list事件
        },
        template: '<div class="pns-page" ng-show="total>0">' +
                        '<div class="page-select">' +
                            '<span >显示行数</span>'+
                            '<select ng-model="pageNumber" ng-options="item.value as item.title for item in pageNumberList" ng-change="pageSelectChange()"></select>' +
                        '</div>' +
                        '<div class="page-total">' +
                            '<span >共</span>'+
                            '<span class="all-total" ng-bind="total" ></span>'+
                            '<span >条</span>'+
                        '</div>' +
                        '<div class="page-button">' +
                            "<span class='button' ng-class='{disabled: page <= 1}' ng-click='pagePrev()'><i class='layui-icon layui-icon-left'></i></span>"+
                            "<span class='button' ng-class='{active:page==1}' ng-click='pageFirst()'>1</span>"+
                            "<span class='button' ng-show='morePrev'><i class='layui-icon layui-icon-more'></i></span>"+
                            "<span class='button' ng-class='{active:page==item}' ng-repeat='item in pageList track by $index' ng-bind='item' ng-click='pageChange(item)'></span>"+
                            "<span class='button' ng-show='moreNext'><i class='layui-icon layui-icon-more'></i></span>"+
                            "<span class='button' ng-class='{active:page==pageMaxSize}' ng-click='pageLast()' ng-bind='pageMaxSize' ng-show='pageLastShow'></span>"+
                            "<span class='button' ng-class='{disabled: page >= pageMaxSize}' ng-click='pageNext()'><i class='layui-icon layui-icon-right'></i></span>"+
                        '</div>' +
                        '<div class="page-jump">' +
                            '<span>跳转至第</span>' +
                            '<input type="text" ng-model="JumpPage" ng-blur="pageJumpChange()">' +
                            '<span>页</span>'+
                            '<button pns-button class-name="layui-btn-primary layui-btn-sm" click="pageSelectChange()" value="确认" ></button>' +
                        '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {

            //当前页码
            scope.page = 1;

            //当前每页的条数
            scope.pageNumber = 10;

            //更多 上一组
            scope.morePrev = false;

            //更多 下一组
            scope.moreNext = false;

            //可选择的每页条数
            scope.pageNumberList = [
                {title:"10", value:10},
                {title:"20", value:20},
                {title:"30", value:30},
                {title:"40", value:40}
            ];

            //执行回调
            scope.callback = function(){
                var _page = {
                    page: scope.page,
                    number: scope.pageNumber
                }
                scope.event({page: _page });
            }

            // 每页显示的条数
            scope.pageSelectChange = function () {
                scope.page = 1;
                scope.JumpPage = 1;
                scope.setPageSize("reset");
                scope.callback();
            };

            //初始化页面标签
            scope.$watch("total",function(cur,old){
                if(cur != 0){
                    scope.setPageSize();
                }
            })
           
            //填充页面标签
            var pageList = []; //页码标签数组
            scope.pageLastShow = false;
            scope.setPageSize = function(isReset){
                if(isReset){
                    pageList = [];
                }

                scope.JumpPage = scope.page;
                scope.pageLastShow = true;

                var maxPage = Math.ceil(scope.total / scope.pageNumber); //最大页码
                var currntPage = scope.page; //当前页码
                
                if(maxPage >= 6 && currntPage > 8){
                    scope.morePrev = true;
                }
                if(maxPage > 8){
                    scope.moreNext = true;

                    if( currntPage < 5){
                        scope.morePrev = false;
                        if(currntPage == 1){
                            pageList = [2,3];
                        } else if(currntPage == 2){
                            pageList = [2,3,4];
                        } else if(currntPage == 3){
                            pageList = [2,3,4,5];
                        } else if(currntPage == 4){
                            pageList = [2,3,4,5,6,7];
                        }
                    } else {
                        scope.morePrev = true;
                        if(maxPage - currntPage <= 3){
                            scope.moreNext = false;
                        }
                        if(currntPage >= maxPage){
                            pageList = [currntPage-5,currntPage-4,currntPage-3,currntPage-2,currntPage-1];
                        }
                        if(maxPage - currntPage == 1){
                            pageList = [currntPage-4,currntPage-3,currntPage-2,currntPage-1,currntPage];
                        } 
                        if(maxPage - currntPage == 2){
                            pageList = [currntPage-3,currntPage-2,currntPage-1,currntPage,currntPage+1];
                        } 
                        if(maxPage - currntPage > 2){
                            pageList = [currntPage-2,currntPage-1,currntPage,currntPage+1,currntPage+2];
                        }
                    }

                } else {
                    scope.morePrev = false;
                    scope.moreNext = false;
                    pageList = [];
                    if(maxPage == 1){
                        scope.pageLastShow = false;
                        pageList = [];
                    } else if(maxPage == 2){
                        scope.pageLastShow = false;
                        pageList = [2];
                    } else {
                        scope.pageLastShow = true;
                        for(var i=2; i < maxPage; i++){
                            pageList.push(i)
                        }
                    }
                }

                scope.pageList = pageList; 
                scope.pageMaxSize = maxPage;
            }

            //页码标签选中
            scope.pageChange = function(number){
                scope.page = number;
                scope.JumpPage = number;
                scope.setPageSize();
                scope.callback();
            }

            //跳转页码触发事件
            scope.JumpPage = 1;
            scope.pageJumpChange = function(){
                var JumpPage = Number(scope.JumpPage);
                if( JumpPage > scope.pageMaxSize){
                    JumpPage = scope.pageMaxSize;
                    scope.JumpPage = scope.pageMaxSize;
                }
                scope.page = JumpPage;
                scope.setPageSize();
                scope.callback();
            };

            // 下一页
            scope.pageNext = function () {
                if(scope.page < scope.pageMaxSize){
                    scope.page++;
                    scope.JumpPage = scope.page;
                    scope.callback();
                    scope.setPageSize();
                }
            };

            // 上一页
            scope.pagePrev = function () {
	            if( scope.page > 1){
                    scope.page-- ;
                    scope.JumpPage = scope.page;
                    scope.callback();
                    scope.setPageSize();
	            }
            };

            //首页
            scope.pageFirst = function(){
                scope.page = 1;
                scope.JumpPage = 1;
                scope.morePrev = false;
                scope.callback();
                scope.setPageSize();
            }

            //尾页
            scope.pageLast = function(){
                scope.page = scope.pageMaxSize;
                scope.JumpPage = scope.pageMaxSize;
                scope.moreNext = false;
                scope.callback();
                scope.setPageSize();
            }

        }
    }
}