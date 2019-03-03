app.controller('newsLetterCtrl', ["$scope", "$http", "$cookies", "$window", "utilService", function($scope, $http, $cookies, $window, $utilService){
   // console.log('In pipedrive controller');

    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1
    };
    $scope.usersdata="";
    $scope.totalSelected = 0;

    if($utilService.users != null && $utilService.users.length > 0){
      $scope.users = $utilService.users;
      $scope.usersdata= $scope.users;
      $scope.users.count = $utilService.users.length;
      $(".tableprogress").hide();
    }else{
      fetchUser();
    }

    function fetchUser(){
      $utilService.getUsers().then(function(users) {
          $scope.users = users;
          $scope.usersdata= $scope.users;
          $scope.users.count = users.length;
          $(".tableprogress").hide();
      });
    }




    $scope.disableBtn = function(){
        if($scope.totalSelected==0){
          return true;
        }else{
          return false;
        }
      }

    $scope.dob = function(dob){
        dob = dob.split("T");
        return $scope.calculateAge(dob[0]);
    }

    $scope.calculateAge = function(birthday) {
        var ageDifMs = Date.now() - new Date(birthday);
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.updateTotal = function(selectedUser) {
        if (selectedUser) {
          $scope.totalSelected++;
        }
        else {
          $scope.totalSelected--;
        }
        console.log("selected", $scope.totalSelected);
    }

  $scope.delete = function () {
        var selected = new Array();
        for (var i = 0; i < $scope.usersdata.length; i++) {
            if ($scope.usersdata[i].selected) {
              selected.push(i);
            }
        }
        console.log("selected rows", selected);
        for (var i = selected.length - 1; i >= 0; i--) {
              $scope.usersdata.splice(selected[i], 1);
        }
        console.log("deleted rows", selected);
        $scope.totalSelected=0;
    };

  $scope.edit = function(user){
      //$utilService.setOrg(user);
      $window.location.href = "#!/users/"+user.id;
  }
  ;
  $scope.selectedUserData = function(){
    var uData = new Array();

    for (var j = 0; j < $scope.usersdata.length; j++) {
        if ($scope.usersdata[j].selected) {
            uData.push($scope.usersdata[j]);
        }
    }
    JSONToCSVConvertor(uData, "User Data", true);
  }

  function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

      var CSV = '';
      //Set Report title in first row or line

      CSV += ReportTitle + '\r\n\n';

      //This condition will generate the Label/Header
      if (ShowLabel) {
          var row = "";

          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {

              //Now convert each value to string and comma-seprated
              row += index + ',';
          }

          row = row.slice(0, -1);

          //append Label row with line break
          CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          var row = "";

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
      }

      if (CSV == '') {
          alert("Invalid data");
          return;
      }

      //Generate a file name
      var fileName = "MyReport_";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g,"_");

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }



}]);


app.controller('editCtrl', ["$scope", "$http", "$routeParams", "$window", "utilService", function($scope, $http, $routeParams, $window, $utilService){

    $scope.userId = $routeParams.userId;

    function fetchUser(){
      if($utilService.users != null) {
        $scope.user = $utilService.getUser($scope.userId);
        $scope.user.age = $scope.dob($scope.user.dateOfBirth);
        return;
      }

      $utilService.getUsers().then(function(users){
          console.log(users);
          $scope.user = $utilService.getUser($scope.userId);
          $scope.user.age = $scope.dob($scope.user.dateOfBirth);
          console.log($scope.user);
      });
    }

    $scope.dob = function(dob) {
      if(dob!= undefined){
        dob = dob.split("T");
        return $scope.calculateAge(dob[0]);
      }
    }

    $scope.calculateAge = function(birthday) {
        var ageDifMs = Date.now() - new Date(birthday);
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.saveUser = function(ev){
        $utilService.saveUser($scope.user);
        $window.location.href = "#!/users/";
        $utilService.showAlert("Saved", "User has been successfully saved!");
        return false;
        //$route.
    }

    $scope.cancelSave = function(ev) {
      console.log($scope.myForm.$dirty);

      if($scope.myForm.$dirty){
        $utilService.showSaveConfirm(ev, function (){
          $window.location.href = "#!/users/";
        },
        function(){
            return;
        });
      }else{
        $window.location.href = "#!/users/";
      }
    }

    fetchUser();


}]);
