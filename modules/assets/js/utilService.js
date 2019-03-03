app.factory('utilService', function($cookies, $window, $mdDialog, $mdToast, $http) {
	var utilService = {};
	utilService.users = null;

  utilService.getUsers = function (callback) {
          console.log("here", utilService.users);
          var fullurl = "data/users.json";
          return $http({method:"GET", url:fullurl, "Content-Type": "application/json"}).then(function(result){
              utilService.users = result.data;
              return result.data;
          });
    }

    utilService.saveUser = function (user) {
        if(utilService.users != null){
            for (var i = 0; i < utilService.users; i++) {
              if(utilService.users[i].id == user.userId){
                  utilService.users[i] = user;
                  return;
              }
            }
         }
    }


    utilService.getUser = function(id) {
        if(utilService.users != null){
            for (var i = 0; i < utilService.users.length; i++) {
              if(utilService.users[i]['id'] == id){
                  return utilService.users[i];
              }
            }
        }
    }


    utilService.showAlert = function(title, message){
        alert = $mdDialog.alert({
            title: title,
            textContent: message,
            ok: 'Close'
        });

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    }


    utilService.showSaveConfirm = function(ev, successCallback, errorCallback) {
      var confirm = $mdDialog.confirm()
          .title('Form Edited')
          .textContent('Looks like data has been changed, do you want to cancel?')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
          successCallback();
      }, function() {
          errorCallback();
      });
  };


    return utilService;
});
