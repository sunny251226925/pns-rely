module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            value: "=", //文本框的值
            click: "&" //放大镜的点击事件
        },
        template: '<div class="pns-library">'+
                        '<input readonly type="text" ng-model="value" required lay-verify="required" class="pns-input">'+
                        '<i class="iconfont iconicons_search_home" ng-click="click(ykf)"></i>'+
                  '</div>',
        link: function(scope,element,attrs) {
           
        }
    }
}