module.exports = function($location,$rootScope,httpService){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            callback: "&", //回调函数
            params: "=?", //请求参数
            accept: "@", //可上传的文件类型
            url: "@", //上传接口url
            root: "=?", //库名
            value: "@?", //按钮名称  非必传
            icon: "@?"  //按钮图标  非必传
        },
        template: '<div class="layui-btn layui-btn-sm layui-btn-primary file" ng-click="fileUpload()">'+
                    '<i class="icon" ng-if="icon"></i>' +
                    '<span>{{value}}</span>'+
                    '<input type="file" accept="{{accept}}" ng-if="fileShow">'+
                  '</div>',
        link: function (scope, element, attr) {
            var ele = angular.element(element);

            function getExplorerInfo() {
                var explorer = window.navigator.userAgent.toLowerCase();
                if (explorer.indexOf("msie") >= 0) {
                    var ver = explorer.match(/msie ([\d.]+)/)[1]; //ie
                    return { type: "IE", version: ver };
                } else if (explorer.indexOf("firefox") >= 0) {
                    var ver = explorer.match(/firefox\/([\d.]+)/)[1]; //firefox
                    return { type: "Firefox", version: ver };
                } else if (explorer.indexOf("chrome") >= 0) {
                    var ver = explorer.match(/chrome\/([\d.]+)/)[1]; //Chrome
                    return { type: "Chrome", version: ver };
                } else if (explorer.indexOf("opera") >= 0) {
                    var ver = explorer.match(/opera.([\d.]+)/)[1]; //Opera
                    return { type: "Opera", version: ver };
                } else if (explorer.indexOf("Safari") >= 0) {
                    var ver = explorer.match(/version\/([\d.]+)/)[1]; //Safari
                    return { type: "Safari", version: ver };
                }
            }

            scope.fileShow = true;
            var version = getExplorerInfo().version.substring(0,1);
            if(getExplorerInfo().type == "IE" && version < 9){
                scope.fileShow = false;
            }

            scope.fileUpload = function(){
                if(!scope.fileShow){
                    $rootScope.layPromise.then(function (layui) {
                        layui.layer.alert('当前浏览器版本过低，不支持文件上传功能，请升级您的浏览器版本！', {
                            skin: 'layui-layer-molv', //样式类名
                            closeBtn: 0
                        });
                    })
                }
            }

            var request = function(form,dom){
                httpService.request({
                    method: 'import',
                    url: "/" + scope.root + scope.url,
                    data: form,
                    dom: dom,
                    isKey: false,
                    isToken: true,
                    root: scope.root ? scope.root : "common"
                }).then(function (res) {
                    scope.callback({result:res})
                });
            }

            ele.on('change', function (e) {
                request(scope.params,e.target);
                e.target.value = null;
            });
        }
    };
}