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
Angular Module Standard Code:
-This Module is based on all of the best practices within the angular-style-guide (jhon papa)
 and has a lot of more coments helpers that's give to you a major organization in how your code your projects.
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= mainModule %>.common',[
            //custom commons modules dependencies
        ]);
    
})();
