module.exports = function(){
    return {
        restrict: 'A',
        scope: {
            validateRegex: "@",  //正则表达式
            ngModel: "=" //文本框的值
        },
        link: function(scope,element,attrs) {
            element.bind("blur",function(e){
                var reg = regex[scope.validateRegex].reg;
                var tips = regex[scope.validateRegex].tips;
                scope.$watch("ngModel",function(val,old){
                    if(reg.test(val)){
                        $(e.target).removeClass("error-input");
                        $(e.target).siblings().remove(".error-tips");
                    } else {
                        $(e.target).addClass("error-input");
                        $(e.target).after("<div class='error-tips'>"+tips+"</div>")
                    }
                })
            })
        }   
    }
}