import pns_button          from  "./lib/pns-button.js";
import pns_date            from  "./lib/pns-date.js";
import pns_download        from  "./lib/pns-download.js";
import pns_evidence        from  "./lib/pns-evidence.js";
import pns_export_data     from  "./lib/pns-export-data.js";
import pns_export          from  "./lib/pns-export.js";
import pns_file            from  "./lib/pns-file.js";
import pns_img_error       from  "./lib/pns-img-error.js";
import pns_img_preview     from  "./lib/pns-img-preview.js";
import pns_import          from  "./lib/pns-import.js";
import pns_input_search    from  "./lib/pns-input-search.js";
import pns_input           from  "./lib/pns-input.js";
import pns_library         from  "./lib/pns-library.js";
import pns_page            from  "./lib/pns-page.js";
import pns_printing        from  "./lib/pns-printing.js";
import pns_search_abc      from  "./lib/pns-search-abc.js";
import pns_search_checkbox from  "./lib/pns-search-checkbox.js";
import pns_search_radio    from  "./lib/pns-search-radio.js";
import pns_search_select   from  "./lib/pns-search-select.js";
import pns_search_tree     from  "./lib/pns-search-tree.js";
import pns_search          from  "./lib/pns-search.js";
import pns_select_multiple from  "./lib/pns-select-multiple.js";
import pns_select_search   from  "./lib/pns-select-search.js";
import pns_select          from  "./lib/pns-select.js";
import pns_submit          from  "./lib/pns-submit.js";
import pns_table_data      from  "./lib/pns-table-data.js";
import pns_table           from  "./lib/pns-table.js";
import pns_validate        from  "./lib/pns-validate.js";


(function (window, angular){ 

    angular.module('pnsDirective', ['ng'])

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
    .directive("pnsSelect",function () {
        return pns_select();
    })

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