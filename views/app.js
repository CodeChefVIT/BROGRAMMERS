var racapp=angular.module("rac",[]);
/*
config(["$routeProvider",function($routeProvider)
{
    $routeProvider.
        when("/", {
            templateUrl: "view/front.html"
        }).
        otherwise({
            templateUrl: "view/front.html"
        });
}]);
*/

racapp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });



racapp.controller("appControl",function($http,$scope){
    


    $http({
        method:'GET',
        url:'/find'}).then(function(response){
            console.log(response.data);
            $scope.mess=response.data;
          });










});