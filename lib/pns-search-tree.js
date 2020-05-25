module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            list: "=",
            tree: "=",
            data: "="
        },
        template: '<div class="pns-search-tree">'+
                    '<div class="search-input" ng-click="searchInputClick()">'+
                        '<div class="card-list">'+
                            '<span class="card-placeholder" ng-if="list.length <= 0">请选择</span>'+
                            '<div class="card" ng-repeat="item in list track by $index">'+
                                '<span ng-bind="item.title"></span>'+
                                '<i class="layui-icon layui-icon-close" ng-click="unoChecked(item)"></i>'+
                            '</div>'+
                        '</div>'+
                        '<div class="icon"><i class="layui-icon layui-icon-down"></i></div>'+
                    '</div>'+
                    '<div class="search-mask" ng-show="searchListShow" ng-click="hideModal($event)"></div>'+
                    '<div class="search-list" tabindex="0" ng-show="searchListShow">'+
                        '<div class="input">'+
                            '<input type="text" ng-model="searchText" placeholder="请输入搜索内容" class="input" ng-keyup="inputKeyUp()">'+
                            '<i class="layui-icon layui-icon-search" ng-show="searchIcon" ></i>'+
                            '<i class="layui-icon layui-icon-close-fill" ng-show="!searchIcon" ng-click="inputClear()"></i>'+
                        '</div>'+    
                        '<div id="tree"></div>'+
                    '</div>'+
                  '</div>',
        link: function(scope,element,attrs) {
 
            //搜索结果集弹层   false：隐藏   true：呈现
            scope.searchListShow = false;

            //搜索input点击事件
            scope.searchInputClick = function(){
                scope.searchListShow = !scope.searchListShow;
            }
            
            scope.tree.then(function(layui){
                var tree = layui.tree;

                var isSelectFalse = function(list){
                    for(var i=0; i<list.length; i++){
                        list[i].checked = false;
                        if( list[i].children && list[i].children.length > 0 ){
                            isSelectFalse(list[i].children);
                        }
                    }
                }

                var isCheckedFalse = function(list,title){
                    for(var i=0; i<list.length; i++){
                        if(list[i].title == title){
                            list[i].checked = false;
                        }
                        if( list[i].children && list[i].children.length > 0 ){
                            isCheckedFalse(list[i].children);
                        }
                    }
                }

                //渲染
                var _tree = tree.render({
                    elem: '#tree',  //绑定元素
                    showCheckbox: true,
                    data: scope.data,
                    oncheck: function(obj){
                        if(obj.checked){
                            scope.list.push(obj.data);
                        } else {
                            for(var i=0; i<scope.list.length; i++){
                                if(scope.list[i].title == obj.data.title){
                                    scope.list.splice(i,1);
                                }
                            }
                        }
                        setTimeout(function(){
                            scope.$apply();
                        },0)
                      }
                });

                //移除已选中的项
                scope.unoChecked = function(item){
                    console.log(item)
                    for(var i=0; i<scope.list.length; i++){
                        if(scope.list[i].title == item.title){
                            scope.list.splice(i,1);
                        }
                    }
                    isCheckedFalse(scope.list,item.title);
                    _tree.reload("tree");
                    scope.searchListShow = false;
                }
            
            })
          

            //隐藏弹层
            scope.hideModal = function(e){
                console.log("=====")
                scope.searchListShow = false;
            }

            scope.searchText = ""; //搜索框值
            scope.searchIcon = true;//搜索框图标  true：显示放大镜   false：实心删除

            //搜索框键盘弹起事件
            scope.inputKeyUp = function(){
                if(scope.searchText != ''){
                    scope.searchIcon = false;
                } else {
                    scope.searchIcon = true;
                }
            }

            //搜索框清空
            scope.inputClear = function(){
                scope.searchText = "";
                scope.searchIcon = true;
            }

        }
    }
}