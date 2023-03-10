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
        .when('/logout', {
            templateUrl: './views/logout.html',
            controller: 'LogoutController'
        })
        .when('/task', {
            templateUrl: './views/task.html',
            controller: 'TaskController'
        })
        .when('/note', {
            templateUrl: './views/note.html',
            controller: 'NoteController'
        })
        .otherwise({
            redirectTo: '/home'
        })

}]);

taskMasterApp.run(['$rootScope', function($rootScope) {

    $rootScope.authenticated = false;
    $rootScope.isAdmin;
    
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        if (previous && previous.originalPath) {
            $rootScope.previousRoute = previous.originalPath;
        }
    });

}]);

taskMasterApp.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
    
    $scope.user = {};
    $scope.loginError;

    $scope.loginUser = () => {
        $http.post('https://todo-list-notes-api.onrender.com/users/login',
        {
            username: $scope.user.username,
            password: $scope.user.password
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            console.log(response.data.non_field_errors);
            if (response.data != null) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', response.data.is_superuser);
                // localStorage.setItem('authenticated', true);

                $rootScope.authenticated = true;
                $rootScope.isAdmin = response.data.is_superuser;

                $location.path('/task');
            };
        },
        () => {
            $scope.loginError = "Login failed, check your credentials";
            $scope.user.username = '';
            $scope.user.password = '';
            $location.path('/');
        });
    };

    // if (localStorage.getItem('authenticated') === 'true') {
    //     console.log('true');
    //     $rootScope.authenticated = true;
    // } else {
    //     $rootScope.authenticated = false;
    // }

}]);


taskMasterApp.controller('LogoutController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {

    $scope.confirmLogout = false;
    let token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');

    $scope.logout = function() {
        if ($scope.confirmLogout) {
            if (token != null && isAdmin != null) {
                localStorage.clear();
                $rootScope.authenticated = false;
                $location.path('/');
            }
        }
    };

    $scope.cancel = function() {
        if ($rootScope.previousRoute) {
            $location.path($rootScope.previousRoute);
        } else {
            $location.path('/');
        }
    };
    
}]);

taskMasterApp.controller('TaskController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.tasks = [];

    $scope.getTasks = function () {
        $http.get('https://todo-list-notes-api.onrender.com/task/', {
        headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            // console.log(response.data.data);
            $scope.tasks = response.data.data.map(task => task);
        })
    };
    
    $scope.getTasks();
}]);

taskMasterApp.controller('NoteController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.notes = [];

    $scope.getNotes = function () {
        $http.get('https://todo-list-notes-api.onrender.com/note/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            $scope.notes = response.data.data.map(note => note);
        });
    };

    $scope.getNotes();
}]);