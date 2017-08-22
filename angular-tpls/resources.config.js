/*globals angular*/
/*
============GULP:GEN==============
Author: Anderson Velez.
E-mail: ajota06@gmail.com.
==================================
----------------------------------
Created By: <%= process.env.USERNAME; %> 
Creation Date: <%= new Date().toISOString().replace(/T/,' ').replace(/\..+/,''); %>.
------------------------------------
Angular Configuration Standard Code:
-This configuration is
 
 To learn more about please see the README.md file.
*/
(function () {

    'use strict';

    angular
        .module('<%= mainModule %>.config')
        .constant('RESOURCES_CONFIG', {
            METHODS: {
                get: 'get',
                post: 'post',
                put: 'put',
                del: 'delete',
                delete: 'delete'
            },
            API: {
                default: '',
            },
            MAIN_TPLS_FOLDER: '<%= AppResources.appName %>/',

        })
        .constant('API_RESOURCES', {
            lenguaje: 'idioma',
            //here is the list of segments of urls provided for the API to get or set the data
            //home: 'home',
            //aboutUs:'About-us'
        });

})();
