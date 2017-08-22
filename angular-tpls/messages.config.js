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
        .constant('SYSTEM_MESSAGES',{
            //CRUD
            CREATE:{
                default: ''
                //here your custom messages
            },
            DELETE:{
                default: ''
                //here your custom messages
                
            },
            UPDATE:{
                default: ''
                //here your custom messages
            },
        
            //ACTIONS
            SAVE:{
                default: ''
                //here your custom messages
            },
            EDIT: {
                default: ''
                //here your custom messages
            },
            CANCEL:{
                default: ''
                //here your custom messages
            },
            RENOVE:{
                default: ''
                //here your custom messages
            },
        
            VARIOUS:{
                default: ''
                //here your custom messages
            }
        });
    
})();
