'use strict';

angular.module('swarm', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/swarm', {
    templateUrl: './swarm/swarm.html',
    controller: 'SwarmCtrl'
  });
}])

.controller('SwarmCtrl', [function() {

}]);
