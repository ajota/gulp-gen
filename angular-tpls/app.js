/*globals angular, document*/
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
        .module('<%= mainModule %>', [
            //external modules dependencies
            'toastr',
            'ui.router',
        
            //custom modules dependencies
            '<%= mainModule %>.config',
            '<%= mainModule %>.common',
            /*@endCustomModule*/
        
        ]);
    angular.bootstrap(document, ['<%= mainModule %>']);
})();
