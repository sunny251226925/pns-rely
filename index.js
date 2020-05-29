var pns_button = require("./lib/pns-button.js");
var pns_date = require("./lib/pns-date.js");
var pns_download = require("./lib/pns-download.js");
var pns_evidence = require("./lib/pns-evidence.js");
var pns_export_data = require("./lib/pns-export-data.js");
var pns_export = require("./lib/pns-export.js");
var pns_file = require("./lib/pns-file.js");
var pns_img_error = require("./lib/pns-img-error.js");
var pns_img_preview = require("./lib/pns-img-preview.js");
var pns_import = require("./lib/pns-import.js");
var pns_input_search = require("./lib/pns-input-search.js");
var pns_input = require("./lib/pns-input.js");
var pns_library = require("./lib/pns-library.js");
var pns_page = require("./lib/pns-page.js");
var pns_printing = require("./lib/pns-printing.js");
var pns_search_abc = require("./lib/pns-search-abc.js");
var pns_search_checkbox = require("./lib/pns-search-checkbox.js");
var pns_search_radio = require("./lib/pns-search-radio.js");
var pns_search_select = require("./lib/pns-search-select.js");
var pns_search_tree = require("./lib/pns-search-tree.js");
var pns_search = require("./lib/pns-search.js");
var pns_select_multiple = require("./lib/pns-select-multiple.js");
var pns_select_search = require("./lib/pns-select-search.js");
var pns_select = require("./lib/pns-select.js");
var pns_submit = require("./lib/pns-submit.js");
var pns_table_data = require("./lib/pns-table-data.js");
var pns_table = require("./lib/pns-table.js");
var pns_validate = require("./lib/pns-validate.js");

(function (window, angular){ 

    angular.module('pnsRely', ['ng'])

    //按钮
    .directive('pnsButton', function () {
        return pns_button();
    })

    //日期时间
    .directive('pnsDate', ["$rootScope", function ($rootScope) {
        return pns_date($rootScope);
    }])

    //下载
    .directive('pnsDownload',  ["$location","$rootScope", function ($location,$rootScope) {
        return pns_download($location,$rootScope);
    }])

    //佐证材料模板
    .directive('pnsEvidence', ['$http', "sessionFactory", function ($http, sessionFactory) {
        return pns_evidence($http, sessionFactory);
    }])
    
    //导出-静态表头
    .directive('pnsExportData', ['httpService', "$rootScope", function (httpService, $rootScope) {
        return pns_export_data(httpService, $rootScope);
    }])

    //导出-动态表头
    .directive('pnsExport', ['httpService', "$rootScope", function (httpService, $rootScope) {
        return pns_export(httpService, $rootScope);
    }])
    
    //上传
    .directive('pnsFile', ['$rootScope','httpService', function ($rootScope, httpService) {
        return pns_file($rootScope, httpService);
    }])

    //图片加载异常处理
    .directive('pnsImgError', function() {
        return pns_img_error();
    })

    //图片预览
    .directive("imgPreview",function () {
        return pns_img_preview();
    })

    //导入
    .directive('pnsImport', ["$location","$rootScope","httpService", function ($location, $rootScope, httpService) {
        return pns_import($location, $rootScope, httpService);
    }])

    //input框-带搜索功能
    .directive('pnsInputSearch', function () {
        return pns_input_search();
    })

    //input框
    .directive('pnsInput', function () {
        return pns_input();
    })

    //input框-带放大镜弹窗
    .directive("pnsLibrary",function () {
        return pns_library();
    })

    //分页
    .directive("pnsPage",function () {
        return pns_page();
    })

    //打印
    .directive('pnsPrinting',function () {
        return pns_printing();
    })

    //搜索表单-平铺列表-带abc字母过滤的列表
    .directive("pnsSearchAbc",function () {
        return pns_search_abc();
    })

    //搜索表单-平铺列表-复选
    .directive("pnsSearchCheckbox",function () {
        return pns_search_checkbox();
    })

    //搜索表单-平铺列表-单选
    .directive("pnsSearchRadio",function () {
        return pns_search_radio();
    })

    //搜索表单-下拉列表
    .directive("pnsSearchSelect",function () {
        return pns_search_select();
    })

    //搜索表单-带tree菜单的
    .directive("pnsSearchTree",function () {
        return pns_search_tree();
    })

    //搜索表单-综合所有元素，为适配动态搜索栏
    .directive('pnsSearch', ["$rootScope", "httpService", function ($rootScope, httpService) {
        return pns_search($rootScope, httpService);
    }])

    //下拉列表-多选
    .directive("pnsSelectMultiple",function () {
        return pns_select_multiple();
    })

    //下拉列表-带搜索
    .directive("pnsSelectSearch",function () {
        return pns_select_search();
    })

    //下拉列表
    .directive("pnsSelect",["httpService","$rootScope", function (httpService,$rootScope) {
        return pns_select(httpService,$rootScope);
    }])

    //表单提交验证
    .directive("pnsSubmit",["regex",function (regex) {
        return pns_submit(regex);
    }])
    
    //table组件-静态数据
    .directive('pnsTableData',function () {
        return pns_table_data();
    })

    //table组件-动态列表头
    .directive('pnsTable', ['httpService', "$rootScope", function (httpService, $rootScope) {
        return pns_table(httpService, $rootScope);
    }])

    //表单元素验证
    .directive("pnsValidate",["regex", function (regex) {
        return pns_validate(regex);
    }])

})(window, window.angular);