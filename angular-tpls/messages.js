/*globals angular*/
(function () {

    'use strict';

    angular
        .module('<%= mainModule %>.common')
        .factory('messagesHandlerFactory', messagesHandlerFactory);

    messagesHandlerFactory.$inject = ['SYSTEM_MESSAGES'];

    function messagesHandlerFactory(SYSTEM_MESSAGES) {

        var notices = SYSTEM_MESSAGES;

        var factory = {
            infoHandler: infoHandler,
            errorsHandler: errorsHandler,
            messagesHandler: messagesHandler,
        };

        return factory;


        function infoHandler(type, mesagge, options) {
            var info = notices.various[message];

            if (angular.isDefined(option)) {
                console.info(info, option);
            } else {
                console.info(mesagge);
            }
        }

        function errorsHandler(action, error, option) {
            var fail = notices[action][error];

            if (angular.isDefined(option)) {
                console.error(fail, option);
            } else {
                console.error(fail);
            }
        }

        /**
        * messages: This function allow to manage any message provider is used to easily change it.
        * @private
        * @method messages
        * @param {String} type: The type of the messages between, success, info, error and warning
        * @param {String or Object} message: This is the string message that will be show to into the pop-up, it can accept an object with the next structure
                                            - {
                                                title:[String], //This is a string to show a title into the pop-up
                                                body: [String] // This is the body copy of the pop-up
                                            }
        * @param {Object} config: This property is an optional feature that can be used to put some additional configurations that the message provider could have.
        * @return {Object} a pop-up message
        */
        function messagesHandler(type, message, config) {
            //
            /*var settings = [];
            
            if(angular.isObject(message)){
                settings = new Array(message.body, message.title);    
            } else{
                settings = new Array(message, '') ;
            }
            if(angular.isObject(config)) {
                settings.push(config);     
            } 
            
            var typeMessage = type.toLowerCase();
            //
            toastr[typeMessage].apply(toastr[typeMessage], settings);*/

            
            alert(notices.various.default);

        }
    }
})();