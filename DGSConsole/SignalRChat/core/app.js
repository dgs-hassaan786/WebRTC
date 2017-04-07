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

    app.factory('SignalRSrvc', ['$rootScope', function ($rootScope) {
        var connection = $.hubConnection('https://demov3connect.webdialer.com' + '/signalr', { //'http://localhost:65251/'
            useDefaultPath: false, jsonp: true, transport: 'webSockets'
        });
        window.communicationHub = connection.createHubProxy('DWDCommunicationHub');
        window.communicationHub.on('newConnection', function (data) {
            $rootScope.$broadcast('newConnectionFromServer', data);
        });
        window.communicationHub.on('broadcastMessage', function (data) {
            $rootScope.$broadcast('sendMessageFromServer', data);
        });

        var conn = {
            init: function () {
                connection.qs = onConnected();
                connection.start().done(function () {
                    console.log('Hub has started');
                    $rootScope.$broadcast('HubStared', true);
                });
            },
            sendMessage: function (senderName, message, recievername) {
                window.communicationHub.invoke('sendMessage', {
                    senderName: senderName,
                    message: message,
                    recievername: recievername
                });
            },
            newConnection: function () {
                window.communicationHub.invoke('newConnection');
            }

        };
        function onConnected() {
            return "Email=" + window.emailID + "&Name=" + window.name + '&Status=' + 'Login'; // hassaankhan@gmail.com
        }
        conn.init();
        return conn;

    }]);

    app.controller('SuperAdminController', function ($scope, SignalRSrvc, $timeout) {
        $scope.disableCall = true;
        $scope.isVideo = false;
        $scope.chatVal = [];
        $scope.showMute = true;
        $scope.enablePause = true;
        $scope.disableElement = [];

        function applyIsVideo(val) {
            $scope.$apply(function () {
                $scope.isVideo = val ? val : false;
                $scope.disableCall = false;
                $timeout(function () {
                    socketHandler.removeEventListners();
                    socketHandler = null;
                    socketHandler = new SocketHandler(window.emailID, window.ipAddress, applyIsVideo, endCall);
                }, 1000);
            });
        }

        function endCall() {
            $scope.$apply(function () {
                $scope.isVideo = false;
                $scope.disableCall = true;
            });
        }

        var socketHandler = new SocketHandler(window.emailID, window.ipAddress, applyIsVideo, endCall);  // alert(data.host);        

        $scope.Name = "Testing Angular";
        $scope.options = { page: 1, pagesize: 10, pagingOptions: [5, 10, 15, 20, 50, 100, 500, 1000] };
        $scope.columns = [{ header: 'Name', field: 'Name' }, { header: 'Email', field: 'Email' }, { header: 'Status', field: 'Status' }]

        $scope.callUser = [];
        $scope.userList = [];

        $scope.$on('HubStared', function (event, data) {
            SignalRSrvc.newConnection();
        });



        $scope.$on('newConnectionFromServer', function (event, agentsData) {

            $scope.$apply(function () {
                var indexUserList = 0;
                for (var i = 0; i < agentsData.length; i++) {
                    if (agentsData[i].Email != $(window)[0].emailID) {
                        $scope.userList[indexUserList] = angular.copy(agentsData[i]);
                        indexUserList++;
                    }
                }
                if ($scope.userList != null) {
                    $scope.userDisplayList = [].concat($scope.userList);
                    for (var i = 0; i < $scope.userList.length; i++) {
                        if ($scope.userList[i].Status == "Login") {
                            $scope.disableElement[i] = false;
                        }
                        else {
                            $scope.disableElement[i] = true;
                        }
                        $scope.chatVal[i] = 0;
                    }
                    $scope.dataLoaded = true;
                }
            });

        });

        $scope.$on('sendMessageFromServer', function (event, data) {

            var senderName = data.senderName;
            var receiverName = data.recievername;
            var message = data.message;
            var chat_show = $(".chat");
            var formattedSenderName = senderName.substring(0, senderName.lastIndexOf("@"));

            if (senderName == window.emailID) {
                $scope.$apply(function () {
                    chat_show.append('<li class="self">' + '<div class="avatar">' + '<img src="/Content/HYcn9xO.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + 'You&nbsp:&nbsp&nbsp&nbsp' + '</strong> ' + '&nbsp&nbsp' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
                });
                return;
            }

            if (receiverName == window.emailID) {
                for (var i = 0; i < $scope.userList.length; i++) {
                    if ($scope.userList[i].Email == senderName) {
                        $scope.$apply(function () {
                            ++$scope.chatVal[i];
                            chat_show.append('<li class="other">' + '<div class="avatar">' + '<img src="/Content/DY6gND0.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + formattedSenderName + '&nbsp:&nbsp&nbsp&nbsp' + '</strong>' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
                        });
                        break;
                    }
                }
                return;
            }


        });


        $scope.gotoChatroom = function (index) {
            for (var i = 0; i < $scope.userList.length; i++) { $scope.chatVal[i] = 0; }
            $scope.userFrom = $(window)[0].emailID;
            $scope.userTo = $scope.userList[index].Email;
            var receiverName = angular.copy($scope.userTo);
            $scope.receiverName = receiverName.substring(0, receiverName.lastIndexOf("@"));
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
            }, false);

        }

        $scope.gotoVideoCall = function (data) {

            $scope.isVideo = true;
            socketHandler.openAudioStream(function () {
                socketHandler.connectOtherParty(data.Email);
                $scope.$apply(function () {
                    $scope.disableCall = false;
                });

            }, true);

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

    app.controller('chatController', function ($scope, SignalRSrvc) {
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
                //$scope.finalConnId = $.connection.hub.id;
                var message = $("#message").val();
                //$.connection.hub.start().done(function () {
                //    chat.server.sendMessage($scope.userFrom, message, $scope.finalConnId, $scope.userTo);
                //});

                SignalRSrvc.sendMessage(window.emailID, message, $scope.userTo);

                $("#message").val("");
                event.preventDefault();
            }
            $scope.sendMessage = function () {
                $scope.finalConnId = $.connection.hub.id;
                var message = $("#message").val();
                //$.connection.hub.start().done(function () {
                //    chat.server.sendMessage($scope.userFrom, message, $scope.finalConnId, $scope.userTo);
                //});

                SignalRSrvc.sendMessage(window.emailID, message, $scope.userTo);

                $("#message").val("");
                event.preventDefault();
            }
            //chat.client.broadcastMessage = function (senderName, message, receiverName) {

            //    var formattedSenderName = senderName.substring(0, senderName.lastIndexOf("@"));

            //    if (senderName == window.emailID) {
            //        $scope.$apply(function () {
            //            chat_show.append('<li class="self">' + '<div class="avatar">' + '<img src="/Content/HYcn9xO.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + 'You&nbsp:&nbsp&nbsp&nbsp' + '</strong> ' + '&nbsp&nbsp' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
            //        });
            //        return;
            //    }

            //    if (receiverName == window.emailID) {
            //        for (var i = 0; i < $scope.userList.length; i++) {
            //            if ($scope.userList[i].Email == senderName) {
            //                $scope.$apply(function () {
            //                    ++$scope.$parent.chatVal[i];
            //                    chat_show.append('<li class="other">' + '<div class="avatar">' + '<img src="/Content/DY6gND0.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + formattedSenderName + '&nbsp:&nbsp&nbsp&nbsp' + '</strong>' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
            //                });

            //                break;
            //            }
            //        }

            //        return;
            //    }



            //    //if (FriendConnID != null) {
            //    //    //added
            //    //    var index = 0;
            //    //    for (var i = 0; i < $scope.userList.length; i++) {
            //    //        if ($scope.userList[i].Email == $scope.userTo) {
            //    //            index = i;
            //    //        }
            //    //    }

            //    //    var sendername = senderName.substring(0, senderName.lastIndexOf("@"));
            //    //    if (senderName == $scope.userFrom) {
            //    //        $scope.$apply(function () {
            //    //            chat_show.append('<li class="self">' + '<div class="avatar">' + '<img src="/Content/HYcn9xO.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + 'You&nbsp:&nbsp&nbsp&nbsp' + '</strong> ' + '&nbsp&nbsp' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
            //    //        });
            //    //    }
            //    //    else {
            //    //        $scope.$apply(function () {
            //    //            ++$scope.$parent.chatVal[index];
            //    //            chat_show.append('<li class="other">' + '<div class="avatar">' + '<img src="/Content/DY6gND0.png" draggable="false"/>' + '</div>' + '<div class="msg">' + '<p><strong>' + sendername + '&nbsp:&nbsp&nbsp&nbsp' + '</strong>' + message + '&nbsp&nbsp' + '</p>' + '&nbsp&nbsp' + '<time>20:18</time>' + '</div>');
            //    //        });

            //    //    }
            //    //}
            //    //else {
            //    //    ('#myModal').modal('toggle');
            //    //}
            //}
        });
    });






    if (typeof initializeApp != undefined && typeof initializeApp === 'function') {
        initializeApp();
    }

})(initializeApp);