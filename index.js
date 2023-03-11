const taskMasterApp = angular.module('taskMasterApp', ['ngRoute']);

taskMasterApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/home', {
            templateUrl: './views/home.html'
        })
        .when('/', {
            templateUrl: './views/landing.html',
            controller: 'LoginController'
        })
        .when('/logout', {
            templateUrl: './views/logout.html',
            controller: 'LogoutController'
        })
        .when('/register', {
            templateUrl: './views/register.html',
            controller: 'RegisterController'
        })
        .when('/task', {
            templateUrl: './views/task.html',
            controller: 'TaskController'
        })
        .when('/create-task', {
            templateUrl: './views/createTask.html',
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
    $rootScope.successMessage;
    
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

    $rootScope.successMessage = '';
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

taskMasterApp.controller('RegisterController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

    $scope.register = {};
    $scope.errorMessage;

    function clearFields() {
        $scope.register.username = '';
        $scope.register.firstName = '';
        $scope.register.lastName = '';
        $scope.register.email = '';
        $scope.register.password = '';
        $scope.register.confirmPassword = '';
    };

    $scope.registerUser = function() {
        $http.post('https://todo-list-notes-api.onrender.com/users/register', 
        {
            username: $scope.register.username,
            first_name: $scope.register.firstName,
            last_name: $scope.register.lastName,
            email: $scope.register.email,
            password: $scope.register.password,
            password2: $scope.register.confirmPassword
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
                $location.path('/');
            };
            // console.log(response.data.data);
        },
        (response) => {
            // console.log(response.data.errors);
            if (response.data.errors.message) {
                $scope.errorMessage = response.data.errors.message;
            } else if (response.data.errors[0].detail) {
                $scope.errorMessage = response.data.errors[0].detail;
            }
            clearFields();
            // console.log($scope.errorMessage);
        });
    };

}]);

taskMasterApp.controller('TaskController', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

    $scope.tasks = [];
    $scope.newTask = {};
    $scope.errorMessage;

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

    function clearFields() {
        $scope.newTask.title = '';
        $scope.newTask.description = '';
        $scope.newTask.deadline = '';
    }

    $scope.createTask = function() {

        let deadline = new Date($scope.newTask.deadline);
        let formattedDeadline = deadline.getFullYear() + '-' + ('0' + (deadline.getMonth()+1)).slice(-2) + '-' + ('0' + deadline.getDate()).slice(-2);
        // console.log(formattedDeadline);
        console.log($scope.newTask.deadline.toISOString().slice(0, 10));
        $http.post('https://todo-list-notes-api.onrender.com/task/', 
        {
            title: $scope.newTask.title,
            description: $scope.newTask.description,
            deadline: formattedDeadline
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            // console.log(response.data);
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $location.path('/task');
            clearFields();
        },
        (response) => {
            console.log(response.data);

            if (response.data.errors[0].detail) {
                $scope.errorMessage = response.data.errors[0].detail;
                // console.log($scope.errorMessage);
            }
            clearFields();
        });

        // console.log(title);
        // console.log(description);
        // console.log(deadline.toISOString().slice(0, 10));
    };
    
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