module.exports = function(regex){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            click: "&", //表单提交事件
            formId: "@",  //表单id
            value: "@", //按钮名称
            icon: "@?", //按钮图标 非必传
            symbol: "=?" //清空识别符
        },
        template: '<button class="layui-btn layui-btn-sm search-btn">' +
                    '<i class="pns-icon {{icon}}" ng-if="icon"></i>' +
                    '<span>{{value}}</span>' +
                  '</button>',
        link: function(scope,element,attrs) {
            element.bind("click",function(e){
                var checkCount = 0; //是否有校验未通过的
                $("#"+scope.formId+" input[validate-regex]").each(function(){
                     //遍历得属到的每一个jquery对象
                    var value = $(this).val();
                    var validate = $(this).attr("validate-regex");
                    var reg = regex[validate].reg;
                    var tips = regex[validate].tips;
                    $(this).siblings().remove(".error-tips");
                    if(reg.test(value)){
                        $(this).removeClass("error-input");
                    } else {
                        checkCount++;
                        $(this).addClass("error-input");
                        $(this).after("<div class='error-tips'>"+tips+"</div>")
                    }
                });
                if(checkCount == 0) {
                    scope.click();
                }
            })

            scope.$watch("symbol",function(val,old){
                if(val != old){
                    $("#"+scope.formId+" input[validate-regex]").each(function(){
                        $(this).siblings().remove(".error-tips");
                        $(this).removeClass("error-input");
                   });
                }
            })
        }   
    }
}