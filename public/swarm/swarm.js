'use strict';

angular.module('swarm', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/swarm', {
    templateUrl: 'public/swarm/swarm.html',
    controller: 'SwarmCtrl'
  });
}])

.controller('SwarmCtrl', [function() {
    
}]);
