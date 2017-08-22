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
Angular MainModule Standard Code:
-This is a module based on all of the best practices within the angular-style-guide (jhon papa)
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= mainModule %>')
        .directive('<%= directiveName %>',<%= directiveName %>);
        
    <%= directiveName %>.$inject = [];
    
    function <%= directiveName %> () {
        
        var directive =  {
            restrict: 'E', //A, C or AEC
            link:link,
            templateUrl:'//here the path to locate the template',
            //scope:{}
        };
        
        return directive;
        
        function link(scope, elem, attrs){
            //enviroment variables
            
            //scope variables
            
            //functions
        }
    }
    
})();
