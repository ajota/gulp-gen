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
Angular Directive Standard Code:
-This directive is based on all of the best practices within the angular-style-guide (jhon papa)
 and has a lot of more coments request that's give to you a major organization in how your code your projects.
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= module %>')
        .factory('<%= factoryName %>Factory', <%= factoryName %>Factory);
    
    <%= factoryName %>Factory.$inject = ['requestsHandlerFactory', 'RESOURCES_CONFIG', 'API_RESOURCES'];
    
    function <%= factoryName %>Factory (requests, RESOURCES_CONFIG, API_RESOURCES) {
        /*--------variables section----------*/
        //Environment variables
        var methods = RESOURCES_CONFIG.METHODS;
        var apiUrl = API_RESOURCES;
        
        var factory = {
            get<%= factoryNameUpper %>Data: get<%= factoryNameUpper %>,
            post<%= factoryNameUpper %>Data: post<%= factoryNameUpper %>,
            update<%= factoryNameUpper %>Data: update<%= factoryNameUpper %>,
            delete<%= factoryNameUpper %>Data: delete<%= factoryNameUpper %> 
        };
        
        return factory;
        
        /*--------Factory functions section----------*/
        //factory functions (resources - unamed functions)
        
        function get<%= factoryNameUpper %> (callback) {
            //Change apiResource property for the real one.
            requests.requestHandler(callback,methods.get, apiUrl.apiResource );
        }

        function post<%= factoryNameUpper %> (obj, callback) {
            //Do something here
            requests.requestHandler(callback, methods.post, obj);
        }
        
        function update<%= factoryNameUpper %> (obj, callback) {
            //Do something here
            requests.requestHandler(callback, methods.put, obj);
        }
        
        function delete<%= factoryNameUpper %> (obj, callback) {
            //Do something here
            requests.requestHandler(callback, methods.delete, obj);
        }
    }
})();
