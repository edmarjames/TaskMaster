const taskMasterApp = angular.module('taskMasterApp', ['ngRoute']);

taskMasterApp.config(['$routeProvider', function($routeProvider) {

    // declare routing
    $routeProvider
        .when('/', {
            templateUrl: './views/landing.html',
            controller: 'LoginController'
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
        .when('/all-users', {
            templateUrl: './views/users.html',
            controller: 'UserController'
        })
        .otherwise({
            redirectTo: '/'
        })

}]);

taskMasterApp.run(['$rootScope', function($rootScope) {

    // get the value of authenticated and isAdmin from the localStorage if page reloads
    $rootScope.authenticated = localStorage.getItem('authenticated');
    $rootScope.isAdmin = localStorage.getItem('isAdmin');

    // declare rootScope success and error message
    $rootScope.successMessage;
    $rootScope.errorMessage;
    
    // stores the previous visited route on rootScope.previousRoute
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        if (previous && previous.originalPath) {
            $rootScope.previousRoute = previous.originalPath;
        }
    });

}]);

taskMasterApp.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', '$timeout', function($scope, $http, $location, $rootScope, $timeout) {
    
    // declare scope objects
    $scope.user = {};
    $scope.loginError;

    // function for login
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
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = 'Successfully logged in';

                // set the token, isAdmin and authenticated as items in the localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', response.data.is_superuser);
                localStorage.setItem('authenticated', true);

                // set the initial value of rootScope authenticated and isAdmin
                $rootScope.authenticated = true;
                $rootScope.isAdmin = response.data.is_superuser;

                // reset the rootScope successMessage and close the alert after 5 seconds
                $timeout(function() {
                    $rootScope.successMessage = null;
                    $('#success-alert').alert('close');
                }, 5000);

                // conditional routing if the authenticated user is an admin or not
                if (response.data.is_superuser == false) {
                    $location.path('/task');
                } else {
                    $location.path('/all-users');
                }
            };
        })
        .catch((response) => {
            // set the scope loginError message
            $scope.loginError = "Login failed, check your credentials";
            // reset the input fields
            clearFields();
            // reset the scope loginError message and close the alert after 5 seconds
            $timeout(function() {
                $scope.loginError = null;
                $('#login-error').alert('close');
            }, 5000);
        });
    };

    // helper function for resetting the value of username and password scope object
    function clearFields() {
        $scope.user.username = '';
        $scope.user.password = '';
    };

}]);

taskMasterApp.controller('LogoutController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {

    // declare initial value of confirmLogout
    $scope.confirmLogout = false;
    // get the values of token and isAdmin from localStorage
    let token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');

    // function for logout
    $scope.logout = function() {
        // if confirmLogout is true
        if ($scope.confirmLogout) {
            // and if token and isAdmin is not null
            if (token != null && isAdmin != null) {
                // clear all items on localStorage
                localStorage.clear();
                // set the authenticated and isAdmin rootScope to false
                $rootScope.authenticated = false;
                $rootScope.isAdmin = false;
                // go back to root route
                $location.path('/');
            };
        };
    };

    // function for cancel button
    $scope.cancel = function() {
        // if there is a previous visited route
        if ($rootScope.previousRoute) {
            // go back to previousRoute
            $location.path($rootScope.previousRoute);
        } else {
            // else go back to task route
            $location.path('/task');
        };
    };
    
}]);

taskMasterApp.controller('RegisterController', ['$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {

    // declare scope objects
    $scope.register = {};
    $scope.errorMessage;

    // function for registering a user
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
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
                // go back to root route
                $location.path('/');
            };
            // close the alert after 5 seconds
            $timeout(function() {
                $('#register-success').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors.message) {
                // set the errorMessage to 'Username already exists'
                $scope.errorMessage = response.data.errors.message;
            } else if (response.data.errors[0].detail) {
                // set the errorMessage to 'Sorry, the password did not match' or 'Enter a valid email address'
                $scope.errorMessage = response.data.errors[0].detail;
            };
            // reset the input fields
            clearFields();
            // set errorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.errorMessage = null;
                $('#register-error').alert('close');
            }, 5000);
        });
    };

    // helper function to clear values of the properties of register object
    function clearFields() {
        $scope.register.username = '';
        $scope.register.firstName = '';
        $scope.register.lastName = '';
        $scope.register.email = '';
        $scope.register.password = '';
        $scope.register.confirmPassword = '';
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

        if (localStorage.getItem('isAdmin') == 'true') {
            $http.get('https://todo-list-notes-api.onrender.com/all_tasks', {
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
        } else {
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
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail == "This field is required.") {
                $scope.errorMessage = 'All fields are required';
            } else {
                $scope.errorMessage = response.data.errors[0].detail;
            }
            clearFields();
            $timeout(function() {
                $scope.errorMessage = null;
                $('#task-error').alert('close');
            }, 5000);
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
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.taskDoesNotExistError = 'Task is not existing';
                $rootScope.previousRoute = '/task';
            }
            $timeout(function() {
                $scope.taskDoesNotExistError = null;
                $('#task-does-not-exist-error').alert('close');
            }, 5000);
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
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.errorMessage = response.data.errors[0].detail;
            };
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
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
                $timeout(function() {
                    $rootScope.successMessage = null;
                    $('#success-alert').alert('close');
                }, 5000);
            })
            .catch((response) => {
                if (response.data.errors[0].detail) {
                    $scope.errorMessage = response.data.errors[0].detail;
                };
                $timeout(function() {
                    $scope.errorMessage = null;
                    $('#error-alert').alert('close');
                }, 5000);
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
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                $scope.errorMessage = response.data.errors.error;
            }
            $scope.getTasks();
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
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
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                $scope.errorMessage = response.data.errors.error;
            }
            $scope.getTasks();
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
        });
    };

    // $('.toast').toast()

}]);

taskMasterApp.controller('NoteController', ['$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', function($rootScope, $scope, $http, $location, $timeout, $routeParams) {

    $scope.notes = [];
    $scope.newNote = {};
    $scope.specificNote = {};
    $scope.noteErrorMessage;
    $scope.noteDoesNotExistError;
    $scope.readOnly = true;
    $scope.confirmDelete = false;
    $scope.dateCreated;
    $scope.dateModified;

    $scope.getNotes = function () {

        if (localStorage.getItem('isAdmin') == 'true') {
            $http.get('https://todo-list-notes-api.onrender.com/all_notes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                $scope.notes = response.data.data.map(note => {
    
                    const dateCreated = new Date(note.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();
                    $scope.dateCreated = dateStringCreated;
    
                    const timeCreated = new Date(note.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    note.attributes.created = timeStringCreated;
    
                    const dateModified = new Date(note.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();
                    $scope.dateModified = dateStringModified;
    
                    const timeModified = new Date(note.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    note.attributes.modified = timeStringModified;
    
                    return note;
                });
            });
        } else {
            $http.get('https://todo-list-notes-api.onrender.com/note/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                $scope.notes = response.data.data.map(note => {

                    const dateCreated = new Date(note.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();
                    $scope.dateCreated = dateStringCreated;

                    const timeCreated = new Date(note.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    note.attributes.created = timeStringCreated;

                    const dateModified = new Date(note.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();
                    $scope.dateModified = dateStringModified;

                    const timeModified = new Date(note.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    note.attributes.modified = timeStringModified;

                    return note;
                });
            });
        };
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
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail == "This field is required.") {
                $scope.noteErrorMessage = 'All fields are required';
            } 
            else {
                $scope.noteErrorMessage = response.data.errors[0].detail;
            };
            clearFields();
            $timeout(function() {
                $scope.noteErrorMessage = null;
                $('#note-error').alert('close');
            }, 5000);
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
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.noteDoesNotExistError = 'Note is not existing';
                $rootScope.previousRoute = '/note';
            }
            $timeout(function() {
                $scope.noteDoesNotExistError = null;
                $('#note-does-not-exists-error').alert('close');
            }, 5000);
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
            }
            $location.path('/note');
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.noteErrorMessage = response.data.errors[0].detail;
            };
            clearFields();
            $timeout(function() {
                $scope.noteErrorMessage = null;
                $('#note-error').alert('close');
            }, 5000);
        });
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
            };
            $location.path('/note');
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                $scope.errorMessage = 'Note Id is not existing';
            }
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
        });
    }

    $scope.goBackToPreviousRoute = function() {
        $rootScope.successMessage = '';
        if ($rootScope.previousRoute) {
            $location.path($rootScope.previousRoute);
        } else {
            $location.path('/note');
        }
    };

    $scope.toggleReadOnly = function() {
        $scope.readOnly = !$scope.readOnly;
    }

}]);

taskMasterApp.controller('UserController', ['$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {

    $scope.users = [];
    $scope.errorMessage;

    $scope.getAllUsers = function() {
        $http.get('https://todo-list-notes-api.onrender.com/all_users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            // console.log(response.data);
            $scope.users = response.data.data.map(users => users);
            // console.log($scope.users)
        })
        .catch((response) => {
            console.log(response.data);
        });
    };
    $scope.getAllUsers();

    $scope.setAsAdmin = function(userId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/set_as_admin/${userId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $scope.getAllUsers();
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                $scope.errorMessage = response.data.errors.error;
            }
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
        });
    };

    $scope.setAsNormalUser = function(userId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/set_as_normal_user/${userId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                $rootScope.successMessage = response.data.data.message;
            };
            $scope.getAllUsers();
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                $scope.errorMessage = response.data.errors.error;
            }
            $timeout(function() {
                $scope.errorMessage = null;
                $('#error-alert').alert('close');
            }, 5000);
        });
    };

}]);