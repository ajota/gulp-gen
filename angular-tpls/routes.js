/*globals angular*/
/*
============GULP:GEN==============
Author: Anderson Velez.
E-mail: ajota06@gmail.com.
==================================
----------------------------------
Created By: 
Creation Date: <%= new Date().toISOString().replace(/T/,' ').replace(/\..+/,''); %>.
------------------------------------
Angular Configuration Standard Code:
-This configuration is
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= module %>')
        .config(<%= routerName %>Routes);
    
    <%= routerName %>Routes.$inject = ['$stateProvider', '$urlRouterProvider', 'SITE_ROUTES', 'RESOURCES_CONFIG' ];
    
    function <%= routerName %>Routes ($state, $router, SITE_ROUTES, RESOURCES_CONFIG) {
        //routes
        var urls = SITE_ROUTES.URLS;
        var states = SITE_ROUTES.STATES;
        var tpls = RESOURCES_CONFIG.MAIN_TPLS_FOLDER;

        $state
            .state(states.<%= routerName %>,{
                url: urls.<%= routerName %>,
                //template: here the Html,   --OR--
                controller: '<%= routerName %>Controller',
                controllerAs: 'vm',
                templateUrl: tpls + '<%= routerName %>/<%= viewName %>.html'
            });
    <% if(!defaultRoute){ %>
        //default route
        $router.when('',urls.home);
    <% }; %>
    }
})();
