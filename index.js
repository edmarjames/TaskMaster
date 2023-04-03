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

taskMasterApp.run(['$rootScope', '$window', function($rootScope, $window) {

    // get the value of authenticated and isAdmin from the localStorage if page reloads
    $rootScope.authenticated = localStorage.getItem('authenticated');
    $rootScope.isAdmin = localStorage.getItem('isAdmin');

    // declare rootScope success and error message
    $rootScope.successMessage;
    $rootScope.errorMessage;
    
    // set the display rootscope object to true if screen size is greater than 576px
    $rootScope.display = $window.innerWidth > 768;

    // checks whether the screen size changes
    angular.element($window).bind('resize', function() {
        $rootScope.$apply(function() {
          $rootScope.display = $window.innerWidth > 768;
        });
    });

    // stores the previous visited route on rootScope.previousRoute
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        if (previous && previous.originalPath) {
            $rootScope.previousRoute = previous.originalPath;
        }
    });

    $rootScope.toggleDisplay = function() {
        $rootScope.display = !$rootScope.display;
    }

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

                // show the toast alert
                $('.toast').toast('show');
                // reset the rootScope successMessage
                $timeout(function() {
                    $rootScope.successMessage = null;
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
            // show the toast alert
            $('.toast').toast('show');
            // reset the scope loginError message
            $timeout(function() {
                $scope.loginError = null;
            }, 5000);
        });
    };

    // helper function for resetting the value of username and password scope object
    function clearFields() {
        $scope.user.username = '';
        $scope.user.password = '';
    };

}]);

taskMasterApp.controller('LogoutController', ['$rootScope', '$scope', '$location', '$timeout', function($rootScope, $scope, $location, $timeout) {

    // declare initial value of confirmLogout
    $scope.confirmLogout = false;
    // get the values of token and isAdmin from localStorage
    let token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');

    // function for logout
    $scope.logout = function() {
        // if confirmLogout is true
        if ($scope.confirmLogout === true) {
            // and if token and isAdmin is not null
            if (token != null && isAdmin != null) {
                // clear all items on localStorage
                localStorage.clear();
                // set the authenticated and isAdmin rootScope to false
                $rootScope.authenticated = false;
                $rootScope.isAdmin = false;
                // go back to root route
                $location.path('/');
                // set the rootScope successMessage
                $rootScope.successMessage = 'Logged out successfully';
                // reset the successMessage after 5 seconds
                $timeout(function() {
                    $rootScope.successMessage = null;
                }, 5000);
            };
        };
    };

    // function for cancel button
    $scope.cancel = function() {
        // if there is no previous route and the previous route is "/"
        if ($rootScope.previousRoute === undefined || $rootScope.previousRoute == "/") {
            // go back to task route
            $location.path('/task');
        // else if there is a previous visited route
        } else if ($rootScope.previousRoute) {
            // go back to previousRoute
            $location.path($rootScope.previousRoute);
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

    // declare scope objects
    $scope.tasks = [];
    $scope.newTask = {};
    $scope.specificTask = {
        id: null,
        title: '',
        description: '',
        status: '',
        formattedDeadline: '',
        created: null,
        modified: null,
        color: null
    };
    $scope.errorMessage;
    $scope.taskDoesNotExistError;
    $scope.readOnly = true;
    $scope.confirmDelete = false;

    /* ---------------------------- MAIN FUNCTIONS ---------------------------- */

    // function for getting all task or specific task for authenticated user
    $scope.getTasks = function () {
        // if authenticated user is an admin, proceed with this GET api call
        if (localStorage.getItem('isAdmin') == 'true') {
            $http.get('https://todo-list-notes-api.onrender.com/all_tasks', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // map the data response to the tasks scope array
                $scope.tasks = response.data.data.map(task => {

                    // format the date created to 'm-d-yyyy' format
                    const dateCreated = new Date(task.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();

                    // format the time created to local time string
                    const timeCreated = new Date(task.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    task.attributes.created = `${dateStringCreated} ${timeStringCreated}`;

                    // format the date modified to 'm-d-yyyy' format
                    const dateModified = new Date(task.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();

                    // format the time modified to local time string
                    const timeModified = new Date(task.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    task.attributes.modified = `${dateStringModified} ${timeStringModified}`;

                    return task;
                });
            });
        // if user is not an admin, proceed with this GET api call
        } else {
            $http.get('https://todo-list-notes-api.onrender.com/task/', {
            headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // map the data response to the tasks scope array
                $scope.tasks = response.data.data.map(task => {

                    // format the date created to 'm-d-yyyy' format
                    const dateCreated = new Date(task.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();

                    // format the time created to local time string
                    const timeCreated = new Date(task.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    task.attributes.created = `${dateStringCreated} ${timeStringCreated}`;

                    // format the date modified to 'm-d-yyyy' format
                    const dateModified = new Date(task.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();

                    // format the time modified to local time string
                    const timeModified = new Date(task.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    task.attributes.modified = `${dateStringModified} ${timeStringModified}`;

                    return task;
                });
            });
        };
    };
    // invoke the getTasks function so that it will run on page load
    $scope.getTasks();

    // function for creating a new task
    $scope.createTask = function() {
        // get the deadline property from the newTask object
        let deadline = new Date($scope.newTask.deadline);
        // format it to 'yyyy-MM-dd'
        let formattedDeadline = deadline.getFullYear() + '-' + ('0' + (deadline.getMonth()+1)).slice(-2) + '-' + ('0' + deadline.getDate()).slice(-2);

        $http.post('https://todo-list-notes-api.onrender.com/task/', 
        {
            title: $scope.newTask.title,
            description: $scope.newTask.description,
            deadline: formattedDeadline,
            color: $scope.newTask.color
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // reset the input fields
            clearFields();
            // go back to task route
            $location.path('/task');
            // show the toast alert
            $('.toast').toast('show');
            // set the rootScope successMessage to null
            $timeout(function() {
                $rootScope.successMessage = null;
            }, 5000);
        })
        .catch((response) => {
            // if error message is 'This field is required.'
            if (response.data.errors[0].detail == "This field is required.") {
                // set the errorMessage to 'All fields are required'
                $scope.errorMessage = 'All fields are required';
            } else {
                // set the errorMessage to 'Operation failed, there is an existing task with the same title.' or 'Deadline cannot be in the past'
                $scope.errorMessage = response.data.errors[0].detail;
            }
            // show the toast alert
            $('.toast').toast('show');
            // reset the input fields
            clearFields();
            // set the scope errorMessage to null
            $timeout(function() {
                $scope.errorMessage = null;
            }, 5000);
        });
    };

    // function for getting specific task
    $scope.getSpecificTask = function() {
        // get the taskId from the route parameter
        let taskId = $routeParams.id;
        // the get API call will only run if the taskId is not null
        if (taskId) {
            $http.get(`https://todo-list-notes-api.onrender.com/task/${taskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // set the properties of specificTask object
                $scope.specificTask.id = response.data.data.id;
                $scope.specificTask.title = response.data.data.attributes.title;
                $scope.specificTask.description = response.data.data.attributes.description;
                $scope.specificTask.status =  response.data.data.attributes.status;

                // set deadline as Date object
                $scope.specificTask.deadline = new Date(response.data.data.attributes.deadline); 
                // format deadline as string
                $scope.specificTask.formattedDeadline = $filter('date')($scope.specificTask.deadline, 'yyyy-MM-dd'); 

                $scope.specificTask.created =  response.data.data.attributes.created;
                $scope.specificTask.modified =  response.data.data.attributes.modified;
                $scope.specificTask.color =  response.data.data.attributes.color;
            })
            .catch((response) => {
                if (response.data.errors[0].detail) {
                    // set the taskDoesNotExistError error message
                    $scope.taskDoesNotExistError = 'Task is not existing';
                    // set the previousRoute to '/task'
                    $rootScope.previousRoute = '/task';
                }
                // show the toast alert
                $('.toast').toast('show');
                // set the taskDoesNotExistError to null
                $timeout(function() {
                    $scope.taskDoesNotExistError = null;
                }, 5000);
            });
        };
    };
    // invoke the getSpecificTask function
    $scope.getSpecificTask();

    // function for updating a task
    $scope.updateTask = function(taskId) {
        // format the deadline to 'yyyy-MM-dd'
        let deadline = $filter('date')($scope.specificTask.deadline, 'yyyy-MM-dd')

        $http.patch(`https://todo-list-notes-api.onrender.com/task/${taskId}/`, 
        {
            title: $scope.specificTask.title,
            description: $scope.specificTask.description,
            deadline: deadline,
            status: $scope.specificTask.status,
            color: $scope.specificTask.color
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            }
            // go back to task route
            $location.path('/task');
            // show the toast alert
            $('.toast').toast('show');
            // set the rootScope successMessage to null
            $timeout(function() {
                $rootScope.successMessage = null;
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                // set the scope errorMessage to 'Deadline cannot be in the past' or 'Operation failed, there is an existing task with the same title.'
                $scope.errorMessage = response.data.errors[0].detail;
            };
            // show the toast alert
            $('.toast').toast('show');
            // set the scope errorMessage to null
            $timeout(function() {
                $scope.errorMessage = null;
            }, 5000);
        });
    };

    // function for deleting a task
    $scope.deleteTask = function() {
        // get the taskId from the route parameter
        let taskId = $routeParams.id;
        // if $scope.confirmDelete is true, proceed with delete
        if ($scope.confirmDelete) {
            $http.delete(`https://todo-list-notes-api.onrender.com/task/${taskId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                if (response.data != null) {
                    // set the rootScope successMessage
                    $rootScope.successMessage = response.data.data.message;
                    // go back to task route
                    $location.path('/task');
                };
                // show the toast alert
                $('.toast').toast('show');
                // set the rootScope successMessage to null
                $timeout(function() {
                    $rootScope.successMessage = null;
                }, 5000);
            })
            .catch((response) => {
                if (response.data.errors[0].detail) {
                    // set the scope errorMessage to 'Not found'
                    $scope.errorMessage = response.data.errors[0].detail;
                };
                // show the toast alert
                $('.toast').toast('show');
                // set the scope errorMessage to null
                $timeout(function() {
                    $scope.errorMessage = null;
                }, 5000);
            });
        };
    };

    // function for archiving a task
    $scope.archiveTask = function(taskId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/tasks/archive/${taskId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // invoke $scope.getTasks function to fetch changes
            $scope.getTasks();
            // show the toast alert
            $('.toast').toast('show');
            // set the rootScope successMessage to null
            $timeout(function() {
                $rootScope.successMessage = null;
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                // set the scope errorMessage to 'Task is already archived'
                $scope.errorMessage = response.data.errors.error;
            };
            // invoke $scope.getTasks function to fetch changes
            $scope.getTasks();
            // show the toast alert
            $('.toast').toast('show');
            // set the scope errorMessage to null
            $timeout(function() {
                $scope.errorMessage = null;
            }, 5000);
        });
    };

    // function for activating a task
    $scope.activateTask = function(taskId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/tasks/activate/${taskId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // invoke $scope.getTasks function to fetch changes
            $scope.getTasks();
            // show the toast alert
            $('.toast').toast('show');
            // set the rootScope successMessage to null
            $timeout(function() {
                $rootScope.successMessage = null;
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                // set the scope errorMessage to 'Task is already activated'
                $scope.errorMessage = response.data.errors.error;
            };
            // invoke $scope.getTasks function to fetch changes
            $scope.getTasks();
            // show the toast alert
            $('.toast').toast('show');
            // set the scope errorMessage to null
            $timeout(function() {
                $scope.errorMessage = null;
            }, 5000);
        });
    };

    /* ---------------------------- HELPER FUNCTIONS ---------------------------- */

    // reset the value of newTask object properties
    function clearFields() {
        $scope.newTask.title = '';
        $scope.newTask.description = '';
        $scope.newTask.deadline = '';
    };

    // go back to task route and invoke clearFields function
    $scope.cancel = function () {
        $rootScope.successMessage = null;
        $location.path('/task');
        clearFields();
    };

    // go back to previous route
    $scope.goBackToPreviousRoute = function() {
        // if there is a previousRoute visited
        if ($rootScope.previousRoute) {
            // go to previous route
            $location.path($rootScope.previousRoute);
        } else {
            // else go back to task
            $location.path('/task');
        }
    };

    // toggles the readOnly to 'true' or 'false'
    $scope.toggleReadOnly = function() {
        $scope.readOnly = !$scope.readOnly;
    };

}]);

taskMasterApp.controller('NoteController', ['$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', function($rootScope, $scope, $http, $location, $timeout, $routeParams) {

    // declare scope objects
    $scope.notes = [];
    $scope.newNote = {};
    $scope.specificNote = {};
    $scope.noteErrorMessage;
    $scope.noteDoesNotExistError;
    $scope.readOnly = true;
    $scope.confirmDelete = false;

    /* ---------------------------- MAIN FUNCTIONS ---------------------------- */

    // function for getting all notes or specific notes for authenticated user
    $scope.getNotes = function () {
        // if the authenticated user is an admin, proceed with this GET api call
        if (localStorage.getItem('isAdmin') == 'true') {
            $http.get('https://todo-list-notes-api.onrender.com/all_notes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // map the data response to notes scope array
                $scope.notes = response.data.data.map(note => {
    
                    // format the date created to 'm-d-yyyy' format
                    const dateCreated = new Date(note.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();
                    $scope.dateCreated = dateStringCreated;
    
                    // format the time created to local time string
                    const timeCreated = new Date(note.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    note.attributes.created = `${dateStringCreated} ${timeStringCreated}`;
    
                    // format the date modified to 'm-d-yyyy' format
                    const dateModified = new Date(note.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();
    
                    // format the time modified to local time string
                    const timeModified = new Date(note.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    note.attributes.modified = `${dateStringModified} ${timeStringModified}`;
    
                    return note;
                });
            });
        // if user is not an admin, proceed with this GET api call
        } else {
            $http.get('https://todo-list-notes-api.onrender.com/note/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // map the data response to notes scope array
                $scope.notes = response.data.data.map(note => {

                    // format the date created to 'm-d-yyyy' format
                    const dateCreated = new Date(note.attributes.created.slice(0, 10));
                    const dateStringCreated = dateCreated.toLocaleDateString();

                    // format the time created to local time string
                    const timeCreated = new Date(note.attributes.created);
                    const timeStringCreated = timeCreated.toLocaleTimeString();
                    note.attributes.created = `${dateStringCreated} ${timeStringCreated}`;

                    // format the date modified to 'm-d-yyyy' format
                    const dateModified = new Date(note.attributes.modified.slice(0, 10));
                    const dateStringModified = dateModified.toLocaleDateString();

                    // format the time modified to local time string
                    const timeModified = new Date(note.attributes.modified);
                    const timeStringModified = timeModified.toLocaleTimeString();
                    note.attributes.modified = `${dateStringModified} ${timeStringModified}`;

                    return note;
                });
            });
        };
    };
    // invoke the getNotes function so that it will run on page load
    $scope.getNotes();

    // function for getting specific note
    $scope.getSpecificNote = function() {
        let noteId = $routeParams.id;
        // the get API call will only run if the noteId is not null
        if (noteId) {
            $http.get(`https://todo-list-notes-api.onrender.com/note/${noteId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                // set the specificNote properties
                $scope.specificNote = {
                    id: response.data.data.id,
                    title: response.data.data.attributes.title,
                    content: response.data.data.attributes.content,
                    color: response.data.data.attributes.color,
                    created: response.data.data.attributes.created,
                    modified: response.data.data.attributes.modified
                };
            })
            .catch((response) => {
                if (response.data.errors[0].detail) {
                    // set the scope noteDoesNotExistError message
                    $scope.noteDoesNotExistError = 'Note is not existing';
                    // set the previousRoute to '/route'
                    $rootScope.previousRoute = '/note';
                }
                // set the scope noteDoesNotExistError to null and close the alert after 5 seconds
                $timeout(function() {
                    $scope.noteDoesNotExistError = null;
                    $('#note-does-not-exists-error').alert('close');
                }, 5000);
            });
        };
    };
    // invoke the getSpecificNote function
    $scope.getSpecificNote();

    // function for creating a note
    $scope.createNote = function() {
        $http.post('https://todo-list-notes-api.onrender.com/note/', 
        {
            title: $scope.newNote.title,
            content: $scope.newNote.content,
            color: $scope.newNote.color
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // go back to note route
            $location.path('/note');
            // set the rootScope successMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            // if error message is 'This field is required.'
            if (response.data.errors[0].detail == "This field is required.") {
                // set the scope noteErrorMessage to 'All fields are required'
                $scope.noteErrorMessage = 'All fields are required';
            } else {
                // set the scope noteErrorMessage to 'Operation failed, there is an existing note with the same title.'
                $scope.noteErrorMessage = response.data.errors[0].detail;
            };
            // reset the input fields
            clearFields();
            // set the scope noteErrorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.noteErrorMessage = null;
                $('#note-error').alert('close');
            }, 5000);
        });
    };

    // function for updating a note
    $scope.updateNote = function(noteId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/note/${noteId}/`, 
        {
            title: $scope.specificNote.title,
            content: $scope.specificNote.content,
            color: $scope.specificNote.color
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage =  response.data.data.message;
            }
            // go back to note route
            $location.path('/note');
            // set the rootScope successMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                // set the noteErrorMessage to 'Operation failed, there is an existing note with the same title'
                $scope.noteErrorMessage = response.data.errors[0].detail.replace(/[{}']/g, '').trim().slice(0, 63);
            };
            // reset the input fields
            clearFields();
            // set the scope noteErrorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.noteErrorMessage = null;
                $('#note-error').alert('close');
            }, 5000);
        });
    };

    // function for deleting a note
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
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;  
            };
            // go back to note route
            $location.path('/note');
            // set the rootScope successMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data.errors[0].detail) {
                // set the scope errorMessage to 'Note is not existing'
                $scope.errorMessage = 'Note is not existing';
            }
            $('.toast').toast('show');
            // set the scope errorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.errorMessage = null;
                // $('#error-alert').alert('close');
            }, 5000);
        });
    };

    /* ---------------------------- HELPER FUNCTIONS ---------------------------- */

    // reset the value of newNote object properties
    function clearFields() {
        $scope.newNote.title = '';
        $scope.newNote.content = '';
    };

    // go back to note route and invoke clearFields function
    $scope.cancel = function() {
        clearFields();
        $location.path('/note');
    };

    // go back to previous route
    $scope.goBackToPreviousRoute = function() {
        // if there is a previousRoute visited
        if ($rootScope.previousRoute) {
            // go to previous route
            $location.path($rootScope.previousRoute);
        } else {
            // else go back to note
            $location.path('/note');
        }
    };

    // toggles the readOnly to 'true' or 'false'
    $scope.toggleReadOnly = function() {
        $scope.readOnly = !$scope.readOnly;
    };

}]);

taskMasterApp.controller('UserController', ['$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {

    // declare scope objects
    $scope.users = [];
    $scope.errorMessage;

    // function for getting all users
    $scope.getAllUsers = function() {
        $http.get('https://todo-list-notes-api.onrender.com/all_users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            // map the data response to users scope array
            $scope.users = response.data.data.map(users => users);
        })
        .catch((response) => {
            // logs the error on the console
            console.log(response.data);
        });
    };
    // invoke the getAllUsers function to run it on page load
    $scope.getAllUsers();

    // function for setting a user as admin
    $scope.setAsAdmin = function(userId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/set_as_admin/${userId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // invoke the $scope.getAllUsers function to fetch changes
            $scope.getAllUsers();
            // set the rootScope successMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                // set the scope errorMessage to 'User is already a superuser'
                $scope.errorMessage = response.data.errors.error;
            };
            $('.toast').toast('show');
            // set the scope errorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.errorMessage = null;
                // $('#error-alert').alert('close');
            }, 5000);
        });
    };

    // function for setting an admin to a normal user
    $scope.setAsNormalUser = function(userId) {
        $http.patch(`https://todo-list-notes-api.onrender.com/set_as_normal_user/${userId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data != null) {
                // set the rootScope successMessage
                $rootScope.successMessage = response.data.data.message;
            };
            // invoke the $scope.getAllUsers function to fetch changes
            $scope.getAllUsers();
            // set the rootScope successMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $rootScope.successMessage = null;
                $('#success-alert').alert('close');
            }, 5000);
        })
        .catch((response) => {
            if (response.data != null) {
                // set the scope errorMessage to 'User is already a normal user'
                $scope.errorMessage = response.data.errors.error;
            };
            $('.toast').toast('show');
            // set the scope errorMessage to null and close the alert after 5 seconds
            $timeout(function() {
                $scope.errorMessage = null;
                // $('#error-alert').alert('close');
            }, 5000);
        });
    };

}]);