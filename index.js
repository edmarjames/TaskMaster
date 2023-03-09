const taskMasterApp = angular.module('taskMasterApp', ['ngRoute']);

taskMasterApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/home', {
            templateUrl: './views/home.html'
        })
        .when('/', {
            templateUrl: './views/login.html',
            controller: 'LoginController'
        })
        .when('/landing', {
            templateUrl: './views/landing.html'
        })
        .otherwise({
            redirectTo: '/home'
        })

}]);

taskMasterApp.run(function() {
    // 
});

taskMasterApp.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    
    $scope.user = {};

    $scope.loginUser = () => {
        $http.post('https://todo-list-notes-api.onrender.com/users/login',
        {
            username: $scope.user.username,
            password: $scope.user.password
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(function(response) {
            
            if (response.data != null) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', response.data.is_superuser);
                $location.path('/landing');
            }
        },
        function(error) {
            console.log(error);
        });
    };

}]);