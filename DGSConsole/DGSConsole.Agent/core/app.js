'use strict';

function initializeApp() {
    angular.bootstrap(document, ['dwdConsole']);
}


var ngApp = (function (initializeApp) {
    var app = angular.module('dwdConsole', [])
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


    app.controller('SuperAdminController', function ($scope) {
        $scope.Name = "Testing Angular";
    });




    if (typeof initializeApp != undefined && typeof initializeApp === 'function') {
        initializeApp();
    }

})(initializeApp);