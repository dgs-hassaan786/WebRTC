'use strict';

function initializeApp() {
    angular.bootstrap(document, ['dwdConsole']);
}
var ngApp = (function (initializeApp) {
    var app = angular.module('dwdConsole', ['smart-table', 'angularUtils.directives.dirPagination'])
     .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
         app.controller = $controllerProvider.register;
         app.directive = $compileProvider.directive;
         app.filter = $filterProvider.register;
         app.factory = $provide.factory;
         app.service = $provide.service;

         //$locationProvider.html5Mode(true);

         /*if (config.routes !== undefined) {
             angular.forEach(config.routes, function (route, path) {
                 $routeProvider.when(path, { templateUrl: route.templateUrl, resolve: dependencyResolverFor(route.dependencies) });
             });
         }
 
         if (config.defaultRoutePaths !== undefined) {
             $routeProvider.otherwise({ redirectTo: config.defaultRoutePaths });
         }*/
     }]);
    app.controller('SuperAdminController', function ($scope, MethodProvider) {
        $scope.Name = "Testing Angular";
        $scope.options = { page: 1, pagesize: 10, pagingOptions: [5, 10, 15, 20, 50, 100, 500, 1000] };
        $scope.columns = [{ header: 'Agent Information', field: 'Name' }, { header: 'Chat', field: 'Chat' }, { header: 'View Screen', field: 'Screen' }, { header: 'Call', field: 'Status' }];
        $scope.userList = [
        { Name: 'Aisha', Chat: 'ac@msn.com', Screen: 'Chat Room', Status: 'wait' },
        { Name: 'Ahmed', Chat: 'ahmed@msn.com', Screen: 'Chat Room', Status: 'active' },
        { Name: 'Dim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Dim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Dim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Dim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Lemon', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Bob', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Dave', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'John', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Kim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Lee', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Gill', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' },
        { Name: 'Dim', Chat: 'dim@msn.com', Screen: 'Chat Room', Status: 'connected' }, ]
        $scope.userDisplayList = [].concat($scope.userList);
        $scope.gotoChatroom = function () {
           window.location.pathname="/Home/ChatRoom";
        }


        $scope.gotoCall = function (data) {



        }
  
    });
    app.controller('chatController', function ($scope) {
        $(document).ready(function () {
            var message = "Hi ";
            $scope.sms = [{ Message: 'Hello', Date: '31-3-2017' },
            { Message: 'hows life going?', Date: '31-3-2017' }
            , { Message: 'I am doing good', Date: '31-3-2017' }
            , { Message: 'on what languages you are working on? .. i might be needing some help', Date: '31-3-2017' }
            , { Message: 'HTML DOM elements', Date: '31-3-2017' }];
            $scope.smsOut = [{ Message: 'Hi Bob', Date: '31-3-2017' },
            { Message: 'I am doing good ', Date: '31-3-2017' },
            { Message: 'am working on multiple things', Date: '31-3-2017' },
            { Message: 'tell me on wat u need help in', Date: '31-3-2017' },
            { Message: 'oh ok lets meet up will surely sort ur problem..', Date: '31-3-2017' }];
            var list = ['Bob', 'Bill', 'Ben', 'John'];
            var chat_show = $(".chat_group div#chat1");
            var tab_menu = $(".chat-content .nav.nav-pills");
            var tab_content = $(".chat-content .tab-content");
            $(".form-chat .send_message").on("click", function (event) {
                var message = $(".form-chat .message").val();
            });
            //Loading Users
            var ol = $(".user_list");
            ol.empty();
            $.each(list, function (key, value) {
                ol.append('<li class="chat_bg" data-id="' + key + '" data-value="' + value + '">' + value + '</li>');
            });
            //Loading messages
            chat_show.append('<p class="left-txt"><strong>' + list[0] + '</strong>: ' + $scope.sms[0].Message  + '</p>');
            chat_show.append('<p class="pull-right "><strong>' + list[1] + '</strong>: ' + $scope.smsOut[0].Message + '</br>' + '</p>');
            chat_show.append('<p class="left-txt"><strong>' + '</br>' + '</br>' + list[0] + '</strong>: ' + $scope.sms[1].Message + '</br>' + '</p>');
            chat_show.append('<p class="pull-right "><strong>' + list[1] + '</strong>: ' + $scope.smsOut[1].Message + '</br>' + '</br>' + '</p>');
            chat_show.append('<p class="left-txt"><strong>' + '</br>' + '</br>' + list[0] + '</strong>: ' + $scope.sms[2].Message + '</br>' + '</p>');
            chat_show.append('<p class="pull-right rgt-txt"><strong>' + list[1] + '</strong>: ' + $scope.smsOut[2].Message + '</br>' + '</br>' + '</p>');
            chat_show.append('<p class="left-txt"><strong>' + '</br>' + '</br>' + list[0] + '</strong>: ' + $scope.sms[3].Message + '</br>' + '</p>');
            chat_show.append('<p class="pull-right rgt-txt"><strong>' + list[1] + '</strong>: ' + $scope.smsOut[3].Message + '</br>' + '</br>' + '</p>');
            chat_show.append('<p class="left-txt"><strong>' + '</br>' + '</br>' + list[0] + '</strong>: ' + $scope.sms[4].Message + '</br>' + '</p>');
            chat_show.append('<p class="pull-right rgt-txt"><strong>' + list[1] + '</strong>: ' + $scope.smsOut[4].Message  + '</p>');
           
            //On click add user in tab
            $(document).on("click", '.user_list li', function () {
                var user_id = $(this).attr("data-id");
                var user_name = $(this).attr("data-value");
                var username = "Bob"
                var chatadded = false;
                if ($('a[data-chat="' + user_name + '"]', tab_menu).length > 0) {
                    chatadded = true;
                }

                if (user_name != username) {
                    var chatid = "chat" + user_id;

                    var li = $("li", tab_menu);

                    if (chatadded == false) {
                        li.removeClass("active");
                        tab_menu.append('<li class="active"><a data-toggle="pill" href="#' + chatid + '" data-id="' + user_id + '" data-chat="' + user_name + '">' + user_name + '</a></li>');
                        $("ul", tab_content).removeClass("in");
                        $("ul", tab_content).removeClass("active");
                        tab_content.append('<ul id=' + chatid + ' class="tab-pane fade in active"></ul>');
                    }
                    else {

                    }
                }
                else {
                    alert("You cannot chat with yourself")
                }
            });
        });
    });

    // http methods
    app.service('MethodProvider', ['$http', function ($http) {
        var self = this;

        self.get = function (url) {
            var obj = {
                url: url,
                method: 'GET',
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(obj);
        };

        self.getPagingData = function (url, pageNo, pageSize) {
            var obj = {
                url: url,
                method: 'GET',
                async: true,
                params: { pageNo: pageNo, pageSize: pageSize },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(obj);
        };

        self.post = function (url, data) {
            var obj = {
                url: url,
                method: 'POST',
                async: true,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(obj);
        };

        self.put = function (url, data) {
            var obj = {
                url: url,
                method: 'PUT',
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (typeof data != 'undefined' && data != null) {
                obj.data = JSON.stringify(data);
            }
            return $http(obj);
        };

        self.delete = function (url) {
            var obj = {
                url: url,
                method: 'POST',
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(obj);
        };
    }]);

    if (typeof initializeApp != undefined && typeof initializeApp === 'function') {
        initializeApp();
    }

})(initializeApp);