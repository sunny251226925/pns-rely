module.exports = function(){
    return {
        restrict: 'EA',
        scope: {
            path: "="
        },
        template: '<div class="imgPreview">' +
                    '<div class="max">' +
                        '<img class="imgPreviewMax" ' +
                              'id="imgPreviewMax"'+
                              'ng-style="imgStyle"' +
                              'ng-src="{{imgPreviewActive ? imgPreviewActive : path[0]}}">' +
                    '</div>' +
                    '<div class="tool">' +
                        '<i class="fa fa-plus" ng-click="imgPreview.plus()"></i>' +
                        '<i class="fa fa-minus"></i>' +
                        '<i class="fa fa-arrows"></i>' +
                        '<i class="fa fa-repeat"></i>' +
                        '<i class="fa fa-reply"></i>' +
                        '<i class="fa fa-share"></i>' +
                        '<i class="fa fa-arrows-h"></i>' +
                        '<i class="fa fa-arrows-v"></i>' +
                    '</div>' +
                    '<ul class="min">' +
                        '<li ng-repeat="item in path"><img ng-src="{{item}}" ng-click="imgPreviewClick(item)"></li>' +
                    '</ul>' +
                  '</div>',
        link: function(scope,element,attrs) {
            scope.imgPreviewClick = function (item) {
                scope.imgPreviewActive = item;
            }
            var dragObj = document.getElementById("imgPreviewMax");
            dragObj.onmousedown = function (event) {
                console.log(event,"down")

                dragObj.onmousemove = function (event) {
                    console.log(event,"move")
                }
                dragObj.onmouseup = function (event) {
                    console.log(event,"up")
                }
            }


            var scale = "1.0";
            scope.imgStyle = {
                transform: "translate(-50%, -50%) scale("+scale+","+scale+")"
            }
            scope.imgPreview = {
                plus: function () {
                    scale = scale.split(".");
                    scale[0] = Number(scale[0]);
                    scale[1] = Number(scale[1]);
                    if(scale[1] < 9){
                        scale[1] ++
                    } else {
                        scale[0] = scale[0] + 1;
                        scale[1] = 0;
                    }
                    scale = scale[0] + "." + scale[1];
                    scope.imgStyle = {
                        transform: "translate(-50%, -50%) scale("+scale+","+scale+")"
                    }
                }
            }
        }
    }
}