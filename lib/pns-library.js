module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            value: "=", //文本框的值
            click: "&", //放大镜的点击事件
            readonly: "=?" //是否禁用
        },
        template: '<div class="pns-library">'+
                        '<input ng-show="readonly" type="text" ng-model="value" required lay-verify="required" class="pns-input">'+
                        '<input ng-show="!readonly" readonly type="text" ng-model="value" required lay-verify="required" class="pns-input">'+
                        '<i class="iconfont iconicons_search_home" ng-click="click(ykf)"></i>'+
                  '</div>',
        link: function(scope,element,attrs) {
          
        }
    }
}