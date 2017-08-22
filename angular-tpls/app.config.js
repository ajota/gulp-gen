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
- This configuration is
 
 To learn more about please see the README.md file.
*/
(function(){
    
    'use strict';
    
    angular
        .module('<%= mainModule %>.config', [])
        .config(requestsConfig)
        .config(angularConfig);
    
    requestsConfig.$inject = ['$httpProvider', 'RESOURCES_CONFIG'];
    
    /**
     * requestsConfig: bloque de configuracion para crear intecepciones para las peticiones http nativas de angular
     * @param dependency {Object} $httpProvider
     * @param dependency {Object} RESOURCES_CONFIG 
     */
    function requestsConfig ($httpProvider, RESOURCES_CONFIG) {
        var apiDefault = RESOURCES_CONFIG.API.default;
        
        function interceptor($q) {

            var interceptor = {
                request: interceptarPeticion,
                response: interceptarRespuesta 
            };

            return interceptor;

            //Functiones de intercepcion
            function interceptarPeticion (config) {
                //logica de intercepcion
                 return config;
            }

            function interceptarRespuesta(response) {
                //logica de intercepcion
                 return response;
            }
        }

        
        //incluye interceptores de peticion
        $httpProvider.interceptors.push(interceptor);
        
    }

    angularConfig.$inject = [];
    /**
     * angularConfig: This method is used to add custom quick functions in angular base object.
     * 
     * WARNING: Please avoid changes in angular native methods, before yo add any function check angular documetation to verify that the name for that funtion does noy exists.
     */
    function angularConfig () {
        var angularCustom = {
            /**
            * isSet: this custom method for angular allows check if any variable is initiated with  valid value. 
            * @param {Any} variable
            */
            isSet: function (variable) {
                return variable !== '' && variable !== null && variable !== undefined;
            }
        };
        
        angular.extend(angular, angularCustom);
    }
    
})();
