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
Angular Controller Standard Code:
-This controller is based on all of the best practices within the angular-style-guide (jhon papa)
 and has a lot of more coments helpers that's give to you a major organization in how your code your projects.
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= module %>')
        .controller('<%= controllerName %>Controller', <%= controllerName %>Controller);
    
    <%= controllerName %>Controller.$inject = ['$scope','<%= factoryName %>Factory'];
    
    function <%= controllerName %>Controller ($scope, <%= controllerName %>Factory) {
        /*jshint validthis:true*/
        var vm = this;
        
        /*--------variables section----------*/
        //Environment variables
        var hello = 'hello';
        
        //Binding variables
        vm.code = 'code';
        vm.initialData = {};
        /*------initialization section-------*/
        //Kick-start functions (initialization functions)
        
        //<%= factoryName %>Factory.get<%= factoryNameUpper %>Data(sync<%= controllerNameUpper %>Data);
        
        /*---------functions section---------*/
        //Angular context functions
        vm.openDialog = function () {
            //Do something here
        };
        
        //callback functions (unamed functions)
        //------ this is to get the date from the factories
        function sync<%= controllerNameUpper %>Data (response) {
            vm.initialData = response;
        }
        
        //various functions (unamed functions)
        function someAction () {
            //Do something here
        }
    }
})();
