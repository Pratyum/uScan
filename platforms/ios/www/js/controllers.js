angular.module('scanner.controllers', ['ionic'])

  .controller('HomeController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $http, $timeout , $ionicModal ,Check,RealCheck , eventName) {
    var vm = this;
    vm.scanResults = '';
    vm.succeedClass = 'Normal';
    $scope.isScan = false;
    $scope.app={};
    $scope.isInEvent ="White";
    $scope.eventMessage="Login to event!";
    $scope.isInValid = "White";
    $scope.user={};
    $scope.message ="";
    $scope.eventName = eventName;
    $scope.timer = null;

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.login = function(){
      if($scope.eventName.eventCode== null || $scope.eventName.eventName == null){
        $scope.isInValid = "Black";
        $scope.message ="Null Values Present";
        $scope.isScan =false;
      }else{
        $http.get("http://172.21.147.177:8000/check/"+$scope.eventName.eventCode).then(function(resp){
          //alert(resp);
          if(resp.data.indexOf('false')== -1){
            $scope.eventName.eventName = resp.data;
            eventName.eventName = resp.data;
            $scope.isInValid ="Green";
            $scope.message="Congrats!It works!";
            $scope.eventMessage ="Change event!";
            $scope.isScan = true;
            $scope.closeModal();
          } else {
            $scope.message="This Event does not Exist!";
            $scope.isInValid="Red";
            $scope.isScan =false;
          }
        },function(err){
          console.log(err);
          $scope.isInValid = "Orange";
          $scope.message = err;
          $scope.isScan =false;
        });
      }
    };



    $scope.getManual = function() {
      if($scope.eventName.eventCode.length>0){
        if($scope.app.matric.length==9 && ($scope.app.matric.indexOf('U')==0 || $scope.app.matric.indexOf('u')==0) && $scope.isScan ==true ){
          $http.get("http://172.21.147.177:8000/register/"+eventName.eventCode+"/"+$scope.app.matric).then(function(resp) {
            if (resp.data.indexOf('New')>=0){
              vm.scanResults = "Added "+$scope.app.matric+" successfully! Please Proceed!";
              vm.succeedClass = "Green";
            }
            else if(resp.data == "This matric is already registered for this event"){
              vm.scanResults = "Sorry "+$scope.app.matric+" Registered";
              vm.succeedClass = "Red";
            }
          }, function(err) {
            console.error('ERR', err);
            // err.status will contain the status code
            vm.succeedClass = "Orange";
            vm.scanResults = err;
          });
        }
        else{
          console.log($scope.app.matric.length==9);
          console.log($scope.app.matric.indexOf('U')==0);
          vm.scanResults = "Invalid Matric Number";
          vm.succeedClass = "Orange";
        }
      }
      else{
        vm.scanResults ="Plese Log in First";
        vm.succeedClass ="Orange";
      }
    };

    vm.successFunc = function(result) {
      // Success! Barcode data is here
      if(result.length==9 && (result.indexOf('U')==0 || result.indexOf('u')==0) && $scope.isScan == true ){
        $http.get("http://172.21.147.177:8000/register/"+eventName.eventCode+"/"+result)
          .then(function(resp) {

            if (resp.data.indexOf('New')>=0) {
              vm.scanResults = "Added "+result+" successfully! Please Proceed!";
              vm.succeedClass = "Green";

              if(result && ionic.Platform.isAndroid()) {
                $scope.timer = $timeout(function () {
                  vm.scan();
                }, 300);
              }

            }
            else if(resp.data.indexOf('already')>=0){
              vm.scanResults = "Sorry "+result+" Registered";
              vm.succeedClass = "Red";
            }
            else{
              vm.scanResults = "Result text '" +resp.data+"'";
            }
          }, function(err) {
            if($scope.timer) {
              $timeout.cancel($scope.timer);
              $scope.timer = null;
            }
            console.error('ERR', err);
            // err.status will contain the status code
            vm.succeedClass = "Orange";
            vm.scanResults = err;
          });

      }
      else {
        if($scope.timer) {
          $timeout.cancel($scope.timer);
          $scope.timer = null;
        }
        vm.scanResults = "Invalid Matric Number: " + result;
        vm.succeedClass = "Orange";
      }

    };

    vm.failureFunc = function(error) {
      if($scope.timer) {
        $timeout.cancel($scope.timer);
        $scope.timer = null;
      }
      // An error occurred
      vm.scanResults = 'Error: ' + error;
      vm.succeedClass = "Orange";
    };

    vm.scan = function(){
      if($scope.eventName.eventCode.length>0){
        $ionicPlatform.ready(function() {
          if(ionic.Platform.isAndroid()){
            $cordovaBarcodeScanner
                .scan()
                .then(function(result){
                //success
                vm.successFunc(result.text);
              }, function(err){
                vm.failureFunc(err);
              });
          } else {
            cloudSky.zBar.scan({
              camera: "back" // defaults to "back"
            }, function(result) {
              vm.successFunc(result);
            }, function(err) {
              vm.failureFunc(err);
            });
          }
        });
      }
      else{
        vm.scanResults =" Please Log in first!";
        vm.succeedClass = "Orange";
      }
    };

  })

  .controller('ListController',function($scope,$http,List,RealList,eventName){
    console.log(RealList.url+eventName.eventCode);
    $http.get(RealList.url+eventName.eventCode).then(function(resp) {
      $scope.list = resp.data;
      $scope.len = Object.keys(resp.data).length;
      $scope.doRefresh =function() {
        console.log(RealList.url+eventName.eventCode);
        $http.get(RealList.url+eventName.eventCode).then(function(resp) {
          $scope.list = resp.data;
          $scope.len = Object.keys(resp.data).length;
          $scope.$broadcast('scroll.refreshComplete');
        },function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        });
      };
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    });
  })

  .controller('LoginCtrl', function($scope, $state , $http ,Check,eventName) {
    $scope.isInValid = "White";
    $scope.user={};
    $scope.message ="";
    $scope.eventName = eventName;
    // $scope.adminLogin = function(){
    //   $state.go('adminLogin');
    // };
    // $scope.forgotPassword = function(){
    //   $state.go('forgotPassword');
    // };
    $scope.login = function(){
      if($scope.eventName.eventCode== null || $scope.eventName.eventName == null){
        $scope.isInValid = "Black";
        $scope.message ="Null Values Present"
      }else{
        $http.get("http://172.21.147.177:8000/check/"+$scope.eventName.eventCode).then(function(resp){
          if(resp.data == $scope.eventName.eventName){
            $scope.isInValid ="Green";
            $scope.message="Congrats!It works!";
            $state.go('tab.home');
          }else{
            $scope.isInValid = "Red";
            $scope.message ="Wrong Password Combination";
          }
        },function(err){
          console.log(err);
          $scope.isInValid = "Orange";
          $scope.message = err;
        });
      }
    };
  });
