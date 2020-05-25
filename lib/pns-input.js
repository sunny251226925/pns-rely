export default function(){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            key: "=",  //要打印的元素id，非必填，如果不传，默认是打印当前页面
            blur: "&?", //焦点失去事件
            disabled: "=" //按钮状态 true:禁止操作   false：可以操作
        },
        template: '<div >' +
                    '<input ng-if="disabled"  type="text" ng-model="key" readonly class="pns-input form-disabled">'+
                    '<input ng-if="!disabled" type="text" ng-model="key" class="pns-input" ng-blur="bulr(key)">'+
                  '</div>',
        link: function (scope, element, attr) {
           
        }
    };
}