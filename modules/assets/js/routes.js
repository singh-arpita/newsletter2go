app.config(function($routeProvider) {
			// route for the home page
			console.log('In route');
			$routeProvider.when('/users/:userId', {
                templateUrl : 'modules/templates/edit.html',
                controller  : 'editCtrl',
            }).when('/users/', {
	                templateUrl : 'modules/templates/home.html',
	                controller  : 'newsLetterCtrl',
						})
						.otherwise({
								redirectTo : '/users/',

						});
});
