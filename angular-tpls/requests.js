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
        .module('<%= mainModule %>.common')
        .factory('requestsHandlerFactory', requestsHandlerFactory);
    
    requestsHandlerFactory.$inject = ['$http', 'messagesHandlerFactory', 'RESOURCES_CONFIG'];
    /**
     * requestsHandlerFactory: this method managed all the request traffic no matter what angular ajax framework has been used.
     * @param dependency {Object} $http[ajaxFramework]
     * @param dependency {Object} messages
     * @param dependency {object} RESOURCES_CONFIG 
     */
    function requestsHandlerFactory ($http, messages, RESOURCES_CONFIG) {
        /*--------variables section----------*/
        //Environment variables
        var catchedError;
        var methods = RESOURCES_CONFIG.METHODS;

        var factory = {
            getError: getError,
            getLiteralError: getLiteralError,
            requestHandler: requestCall,
        };
        
        return factory;
        
        /**
        * getError: This method catch the actual error from "requtesCall".
        * @private
        * @method getLiteralError
        * @return {Object} Javascript Object to be manipulated
        */
        function getError () {
            return catchedError;
        }
        
        /**
        * getLiteralError: This method catch the actual error from "requtesCall"  function and it will return a string instad a object.
        * @private
        * @method getLiteralError
        * @return {String} Text ready to show to the user
        */
        function getLiteralError () {
            var literalError = getError();
            return literalError.data.error;
        }

        /**
         * Function handles all variation of GET queries.  The requestFor will contain an array with various resource/
         * value objects used to construct the query.  The query is constructed in order of object placement.
         * The resource at the end fo the array will be the primary resource being requested.  The subsequent
         * objects are the relationships
         * associated with the returning resource.
         *
         * @param requestFor
         * @param options {
         *      queryString: {}
         *      resources: [
         *          {key: 'APIResource', value: 'value'}
         *      ]
         * }
         * @returns {*}
         */
        function handlerGetRequests (requestFor, queryString) {
            
            var request;
            if(angular.isSet(requestFor)){
                var path;
                //build query
                if(requestFor.length === 1) {
                    //single get query
                    path = requestFor[0];
                    request = (path.value) ? restangular.one(path.resource,path.value) :
                        restangular.one(path.resource);

                }else {
                    //path query with multiple resources

                    //relationship get query; build path query leave out last object
                    for (var i in requestFor) {
                        path = requestFor[i];

                        //if value set apply to restangular query path
                        if(!request){
                            request = restangular.one(path.resource,path.value);
                        }else{
                            request = (path.value) ? request.one(path.resource, path.value) : request.one(path.resource) ;
                        }
                        
                    }
                }

                //execute query
                if(queryString){
                   //todo revisit this case where you have a query string for lists and single requests
                    request = request.get(options.queryString);
                }else if(requestFor.length > 1 &&  !requestFor[requestFor.length-1].value){
                    //list query
                    request = request.getList();
                }else if(requestFor.length > 1 && requestFor[requestFor.length-1].value){
                    //single query
                    request = request.get(requestFor[requestFor.length-1].resource,
                        requestFor[requestFor.length-1].value);
                }else{
                    request = request.get();
                }

                //return query
                return request;
            }
            messages.messagesHandler('suggestion', 'noRequestUrl');
        }

        function handlerPostRequests (requestFor, obj) {
            
            var request;
            var expected = angular.isSet(obj);

            if(expected){
                 //path post
                 if(requestFor[0].value){
                     var resource = requestFor[0].resource;
                     var value = requestFor[0].value;

                     request = restangular.one(resource,value).post(requestFor[1].resource,obj);
                 }else {
                     //single resource post
                     var resource = requestFor[0].resource;
                     request = restangular.all(resource).post(obj);
                 }
                return request;
            }
            messages.messagesHandler('suggestion', 'objectExpected');
        }

        function handlerModificatorsRequests (obj, roll, requestFor) {
            /*jshint validthis:true*/
            var rolls = ['delete'];
            var request;
            var action = (rolls.indexOf(roll)) ? 'remove' : roll ;
            
            if(angular.isDefined(requestFor)){
                request = restangular.one.apply(requestFor);
            }else{
                if(obj.restangularized){
                    request = obj[action]();
                    return request;
                }
            }
            
            messages.messagesHandler('suggestion', 'objectRestangularized');
        }

        /**
         * Function handles a delete requests which consist of a resource to remove along the id associated with the
         * resource that identifies the resource.
         *
         * e.g. [{resource:'campaign', value:'12345'}]
         *
         * @param requestFor - Array with an object consisting of a resource and a value attribute.
         * @returns {*}
         */
        function handlerDeleteRequests (requestFor){

            var request;

            if(requestFor) {
                //single delete request
                var resource = requestFor[0].resource;

                if(requestFor[0].value) {
                    var value = requestFor[0].value;

                    request = restangular.one(resource, value).remove();
                }else{
                    request = restangular.one(resource).remove();
                }
                return request;
            }

            messages.messagesHandler('suggestion', 'objectRestangularized');
        }


        //Handler HttpRequest
        /**
        * requestCall: This is the handler of every request that the site will need make.
        * 
        * @param {function} callback
        * @param {String} action: This param should be taken from the Methods constants
        * @param {Array} or {String}
        *       resource: '/my/API/resource'
                OR
        *       resource: [
        *           {resource: , value: }   
        *       ]
        * @param {Object} options: {
        *       object: {}
        *       queryString: {}
        * }
        */
        function requestCall ( callback, action, resource, options) {
            
            //Do something here with this
            var request;
            var requestFor = (angular.isArray(resource)) ? resource : [resource] ;
            
            switch(action) {
                case methods.get:
                       var query = options.queryString || options.object ;
                       request = handlerGetRequests(requestFor, query);
                    break;
                case methods.post:
                       request = handlerPostRequests(requestFor, options.object);
                    break;
                //case methods.put:
                case methods.delete:
                case methods.del:
                    request = handlerDeleteRequests(requestFor);
                    break;
                default:
                       messages.messagesHandler('suggestion', 'actionInvalid', methods);
                    break;
            }

            request.then(
                function ( response ) {
                    callback(response);
                },
                function ( error ) {
                    callback(error);
                    catchedError = error;
                }
            );
            
        }
    }
})();
