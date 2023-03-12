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
        .when('/task/:id', {
            templateUrl: './views/taskView.html',
            controller: 'TaskController'
        })
        .when('/task/delete/:id', {
            templateUrl: './views/task.html',
            controller: 'TaskController'
        })
        .when('/note', {
            templateUrl: './views/note.html',
            controller: 'NoteController'
        })
        .when('/create-note', {
            templateUrl: './views/createNote.html',
            controller: 'NoteController'
        })
        .when('/note/:id', {
            templateUrl: './views/noteView.html',
            controller: 'NoteController'
        })
        .when('/note/delete/:id', {
            templateUrl: './views/note.html',
            controller: 'NoteController'
        })
        .otherwise({
            redirectTo: '/home'
        })

}]);

taskMasterApp.run(['$rootScope', function($rootScope) {

    $rootScope.authenticated = localStorage.getItem('authenticated');
    $rootScope.isAdmin = localStorage.getItem('isAdmin');
    $rootScope.successMessage;
    $rootScope.errorMessage;
    
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
                localStorage.setItem('authenticated', true);

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
                $rootScope.isAdmin = false;
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

taskMasterApp.controller('TaskController', ['$rootScope', '$scope', '$http', '$location', '$routeParams', '$filter', '$timeout', function($rootScope, $scope, $http, $location, $routeParams, $filter, $timeout) {

    $scope.tasks = [];
    $scope.newTask = {};
    $scope.specificTask = {
        id: null,
        title: '',
        description: '',
        status: '',
        formattedDeadline: '',
        created: null,
        modified: null
    };
    $scope.errorMessage;
    $scope.taskDoesNotExistError;
    $scope.readOnly = true;
    $scope.confirmDelete = false;
    $scope.dateCreated;
    $scope.dateModified;

    $scope.getTasks = function () {
        $http.get('https://todo-list-notes-api.onrender.com/task/', {
        headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            $scope.tasks = response.data.data.map(task => {

                const dateCreated = new Date(task.attributes.created.slice(0, 10));
                const dateStringCreated = dateCreated.toLocaleDateString();
                $scope.dateCreated = dateStringCreated;

                const timeCreated = new Date(task.attributes.created);
                const timeStringCreated = timeCreated.toLocaleTimeString();
                task.attributes.created = timeStringCreated;

                const dateModified = new Date(task.attributes.modified.slice(0, 10));
                const dateStringModified = dateModified.toLocaleDateString();
                $scope.dateModified = dateStringModified;

                const timeModified = new Date(task.attributes.modified);
                const timeStringModified = timeModified.toLocaleTimeString();
                task.attributes.modified = timeStringModified;

                return task;
            });
        });
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
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $location.path('/task');
            clearFields();
        },
        (response) => {
            if (response.data.errors[0].detail) {
                $scope.errorMessage = response.data.errors[0].detail;
            }
            clearFields();
        });
    };

    $scope.cancel = function () {
        $rootScope.successMessage = '';
        $location.path('/task');
        clearFields();
    };

    $scope.goBackToPreviousRoute = function() {
        if ($rootScope.previousRoute) {
            $location.path($rootScope.previousRoute);
        } else {
            $location.path('/task');
        }
    };

    $scope.getSpecificTask = function() {
        let taskId = $routeParams.id;
        $http.get(`https://todo-list-notes-api.onrender.com/task/${taskId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            $scope.specificTask.id = response.data.data.id;
            $scope.specificTask.title = response.data.data.attributes.title;
            $scope.specificTask.description = response.data.data.attributes.description;
            $scope.specificTask.status =  response.data.data.attributes.status;
            $scope.specificTask.deadline = new Date(response.data.data.attributes.deadline); // set deadline as Date object
            $scope.specificTask.formattedDeadline = $filter('date')($scope.specificTask.deadline, 'yyyy-MM-dd'); // format deadline as string
            $scope.specificTask.created =  response.data.data.attributes.created;
            $scope.specificTask.modified =  response.data.data.attributes.modified;
        },
        (response) => {
            if (response.data.errors[0].detail) {
                $scope.taskDoesNotExistError = 'Task Id is not existing';
                $rootScope.previousRoute = '/task';
                
            }
        });
    }
    $scope.getSpecificTask();

    $scope.toggleReadOnly = function() {
        $scope.readOnly = !$scope.readOnly;
    }

    $scope.updateTask = function(taskId) {
        let deadline = $filter('date')($scope.specificTask.deadline, 'yyyy-MM-dd')

        $http.patch(`https://todo-list-notes-api.onrender.com/task/${taskId}/`, 
        {
            title: $scope.specificTask.title,
            description: $scope.specificTask.description,
            deadline: deadline,
            status: $scope.specificTask.status
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            }
            $location.path('/task');
        },
        (response) => {
            if (response.data.errors[0].detail) {
                $scope.errorMessage = response.data.errors[0].detail;
            };
        });
    };

    $scope.deleteTask = function() {
        let taskId = $routeParams.id;
        if ($scope.confirmDelete) {
            $http.delete(`https://todo-list-notes-api.onrender.com/task/${taskId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                if (response.data != null) {
                    $rootScope.successMessage = response.data.data.message;
                    $location.path('/task');
                }
            },
            (response) => {
                if (response.data.errors[0].detail) {
                    $rootScope.errorMessage = response.data.errors[0].detail;
                };
            });
        };
    };

    $scope.archiveTask = function(taskId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/tasks/archive/${taskId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $scope.getTasks();
        },
        (response) => {
            console.log(response.data.errors.error);
            if (response.data != null) {
                $rootScope.errorMessage = response.data.errors.error;
            }
            $scope.getTasks();
        });
    };

    $scope.activateTask = function(taskId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/tasks/activate/${taskId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $scope.getTasks();
        },
        (response) => {
            console.log(response.data.errors.error);
            if (response.data != null) {
                $rootScope.errorMessage = response.data.errors.error;
                $scope.getTasks();
            }
        });
    };

    $timeout(function() {
        $('#success-alert').alert('close');
    }, 5000);

    $timeout(function() {
        $('#alert-error').alert('close');
    }, 7000);

    $('.toast').toast()

}]);

taskMasterApp.controller('NoteController', ['$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', function($rootScope, $scope, $http, $location, $timeout, $routeParams) {

    $scope.notes = [];
    $scope.newNote = {};
    $scope.specificNote = {};
    $scope.noteErrorMessage;
    $scope.noteDoesNotExistError;
    $scope.readOnly = true;
    $scope.confirmDelete = false;

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

    function clearFields() {
        $scope.newNote.title = '';
        $scope.newNote.content = '';
    };

    $scope.createNote = function() {
        $http.post('https://todo-list-notes-api.onrender.com/note/', 
        {
            title: $scope.newNote.title,
            content: $scope.newNote.content
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            }
            $location.path('/note');
            console.log(response.data);
            // console.log(response.data.data.message);
            // console.log($scope.message);
        },
        (response) => {
            if (response.data.errors[0].detail == "This field is required.") {
                $scope.noteErrorMessage = 'All fields are required';
            } 
            else if (response.data.errors[0].detail == "Operation failed, there is an existing note with the same title.") {
                $scope.noteErrorMessage = response.data.errors[0].detail;
            };
            clearFields();
            console.log($scope.noteErrorMessage);
        });
    }

    $scope.cancel = function() {
        clearFields();
        $location.path('/note');
    };

    $scope.getSpecificNote = function() {
        let noteId = $routeParams.id;
        $http.get(`https://todo-list-notes-api.onrender.com/note/${noteId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            $scope.specificNote = {
                id: response.data.data.id,
                title: response.data.data.attributes.title,
                content: response.data.data.attributes.content,
                created: response.data.data.attributes.created,
                modified: response.data.data.attributes.modified
            };
        },
        (response) => {
            if (response.data.errors[0].detail) {
                $scope.noteDoesNotExistError = 'Note Id is not existing';
                $rootScope.previousRoute = '/note';
            }
        });
    };
    $scope.getSpecificNote();

    $scope.updateNote = function(noteId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/note/${noteId}/`, 
        {
            title: $scope.specificNote.title,
            content: $scope.specificNote.content
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage =  response.data.data.message;
                $location.path('/note');
                console.log($rootScope.successMessage);
            }
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.noteErrorMessage = response.data.errors[0].detail;
                console.log($scope.noteErrorMessage);
            };
            clearFields();
        })
    }

    $scope.goBackToPreviousRoute = function() {
        $rootScope.successMessage = '';
        if ($rootScope.previousRoute) {
            $location.path($rootScope.previousRoute);
        } else {
            $location.path('/note');
        }
    };

    $scope.deleteNote = function() {
        let noteId = $routeParams.id;
        $http.delete(`https://todo-list-notes-api.onrender.com/note/${noteId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
                $location.path('/note');
                console.log($rootScope.successMessage);
            }
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $rootScope.errorMessage = 'Note Id is not existing';
            }
        });
    }

    $scope.toggleReadOnly = function() {
        $scope.readOnly = !$scope.readOnly;
    }

    $timeout(function() {
        $('#success-alert').alert('close');
    }, 5000);

    $timeout(function() {
        $('#alert-error').alert('close');
    }, 5000);
}]);