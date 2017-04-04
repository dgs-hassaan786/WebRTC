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


    app.controller('SuperAdminController', function ($scope) {        
        $scope.disableCall = true;
        $scope.isVideo = false;
        $scope.chatVal = 0;
        $scope.disableElement = [];

        function applyIsVideo(val) {
            $scope.$apply(function(){
                $scope.isVideo = val ? val : false;
                $scope.disableCall = false;
            });
        }

        function endCall() {
            $scope.$apply(function () {
                $scope.isVideo = false;
                $scope.disableCall = false;
            });
        }

        var socketHandler = new SocketHandler(window.emailID, window.ipAddress, applyIsVideo, endCall);  // alert(data.host);
                     
        $scope.Name = "Testing Angular";
        $scope.options = { page: 1, pagesize: 10, pagingOptions: [5, 10, 15, 20, 50, 100, 500, 1000] };
        $scope.columns = [{ header: 'Name', field: 'Name' }, { header: 'Email', field: 'Email' }, { header: 'Status', field: 'Status' }]

  
       
        $(function () {
            // Reference the auto-generated proxy for the hub.
            var chat = $.connection.chatHub;

            $scope.callUser = [];
            // Create a function that the hub can call back to return list of all users that are connected
            chat.client.newConnection = function (agentsData) {
                $scope.$apply(function () {
                    $scope.userList = angular.copy(agentsData);
                    $scope.userDisplayList = [].concat($scope.userList);
                    if ($scope.userList != null) {
                        for (var i = 0; i < $scope.userList.length; i++) {
                            if ($scope.userList[i].Status == "Login") {
                                $scope.disableElement[i] = false;
                            }
                            else {
                                $scope.disableElement[i] = true;
                            }
                        }
                        $scope.dataLoaded = true;
                    }
                })
            };

            $.connection.hub.start().done(function () {
                chat.server.newConnection();
            });
        });

        $scope.gotoChatroom = function (index) {
            $scope.userFrom = $(window)[0].emailID;
            $scope.userTo = $scope.userList[index].Email;
            $scope.$broadcast('myEvent', {
                userfrom: $scope.userFrom,
                userto: $scope.userTo
            })
        }
        $scope.gotoCall = function (data) {
            $scope.isVideo = false;
            socketHandler.openAudioStream(function () {
                socketHandler.connectOtherParty(data.Email);
                $scope.$apply(function () {
                    $scope.disableCall = false;
                });
            },false);
            
        }

        $scope.gotoVideoCall = function (data) {

            $scope.isVideo = true;
            socketHandler.openAudioStream(function () {
                socketHandler.connectOtherParty(data.Email);
                $scope.$apply(function () {
                    $scope.disableCall = false;
                });
                
            },true);
    
        }

        $scope.endCall = function () {
            socketHandler.endCall();
            $scope.disableCall = true;
            $scope.isVideo = false;
        }
  
        $scope.disableControl = function (data) {
            //if (data == "Log out" || disableCall) {           
            //        return true;             
            //}
            return false;
        }


    });

    app.controller('chatController', function ($scope) {
        $(function () {
            var chat = $.connection.chatHub;
            var userFrom = $scope.userFrom;
            var userTo = $scope.userTo;
            var chat_show = $(".chat");
            $scope.$on('myEvent', function (event, message) {
                $scope.userFrom = message.userfrom;
                $scope.userTo = message.userto;
            })
            $('#message').keypress(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) {
                    sendMessage();
                }
            })
            var sendMessage = function () {
                $scope.hiddenID = $('#hdId').val();
                $scope.finalConnId = $.connection.hub.id;
                var message = $("#message").val();
                $.connection.hub.start().done(function () {
                    chat.server.sendMessage($scope.userFrom, message, $scope.finalConnId, $scope.userTo);
                });
                $("#message").val("");
                event.preventDefault();
            }
            $scope.sendMessage = function () {
                $scope.hiddenID=  $('#hdId').val();
                $scope.finalConnId = $.connection.hub.id;
                var message = $("#message").val();
                $.connection.hub.start().done(function () {
                    chat.server.sendMessage($scope.userFrom, message, $scope.finalConnId, $scope.userTo);
                });
                $("#message").val("");
                event.preventDefault();
            }      
            chat.client.broadcastMessage = function (senderName, message, FriendConnID) {
                if (FriendConnID != null) {
                    var sendername = senderName.substring(0, senderName.lastIndexOf("@"));
                    if (senderName == $scope.userFrom) {
                        chat_show.append('<li class="self">' + '<div class="avatar">' + '<img src="http://i.imgur.com/HYcn9xO.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + 'You&nbsp:&nbsp&nbsp&nbsp' + '</strong> ' + '&nbsp&nbsp' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
                    }
                    else {
                        $scope.$apply(function () {
                            ++$scope.$parent.chatVal;
                        });
                        chat_show.append('<li class="other">' + '<div class="avatar">' + '<img src="http://i.imgur.com/DY6gND0.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + sendername + '&nbsp:&nbsp&nbsp&nbsp' + '</strong>' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
                    }
                }
                else {
                    ('#myModal').modal('toggle');
                }
            }

        });
    });

   
    if (typeof initializeApp != undefined && typeof initializeApp === 'function') {
        initializeApp();
    }

})(initializeApp);