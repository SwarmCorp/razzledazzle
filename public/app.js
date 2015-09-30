'use strict';


angular.module('swarmApp', [
    'ngRoute',
    'swarm',
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/swarm'
    });
}]);
