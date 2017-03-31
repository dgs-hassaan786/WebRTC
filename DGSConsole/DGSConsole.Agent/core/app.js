'use strict';

function initializeApp() {
    angular.bootstrap(document, ['dwdConsole']);
}


var ngApp = (function (initializeApp) {
    var app = angular.module('dwdConsole', ['smart-table', 'angularUtils.directives.dirPagination'])
     .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
         function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
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


    app.controller('SuperAdminController', function ($scope) {
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
    });
    if (typeof initializeApp != undefined && typeof initializeApp === 'function') {
        initializeApp();
    }

})(initializeApp);