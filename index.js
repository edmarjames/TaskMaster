const taskMasterApp = angular.module('taskMasterApp', []);

taskMasterApp.config(function() {
    // 
});

taskMasterApp.run(function() {
    // 
});

taskMasterApp.controller('LoginController', ['$scope', '$http', function($scope, $http) {
    
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
            console.log(response.data)
        },
        function(error) {
            console.log(error);
        });
    };

}]);