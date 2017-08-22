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
(function(){
    
    'use strict';
    
    angular
        .module('<%= mainModule %>.config')
        .constant('SITE_ROUTES',{
            URLS: {
                //here is the root folder of the site
                /*@endUrls*/ 
            },
            STATES: {
                //here is you states names
                /*@endRoutes*/ 
            }
        });
    
})();
