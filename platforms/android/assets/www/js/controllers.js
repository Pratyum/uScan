angular.module('scanner.controllers', ['ionic'])

  .controller('HomeController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform,$http, $timeout ,eventName) {
        var vm = this;
        vm.scanResults = '';
        vm.succeedClass = 'Normal';
        $scope.app={};
        console.log(eventName.eventCode);
        $scope.getManual = function() {
          if($scope.app.matric.length==9 && $scope.app.matric.indexOf('U')==0){
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
                    console.log($scope.app.matric.indexOf(0)=='U');
                    
                    vm.scanResults = "Invalid Matric Number";
                    vm.succeedClass = "Orange"; 
          }
        };

        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        if(result.text.length==9 && result.text.indexOf('U')==0){
                          $http.get("http://172.21.147.177:8000/register/"+eventName.eventCode+"/"+(result.text+Math.floor(Math.random() * 10000) + 1) ).then(function(resp) {
                              if (resp.data.indexOf('New')>=0) {
                                  vm.scanResults = "Added "+result.text+" successfully! Please Proceed!";
                                  vm.succeedClass = "Green";
                                  if(!result.cancelled) {
                                      $timeout(function () {
                                          vm.scan();
                                      }, 300);
                                  }
                              }
                              else if(resp.data.indexOf('already')>=0){
                                  vm.scanResults = "Sorry "+result.text+" Registered";
                                  vm.succeedClass = "Red";    
                              }
                              else{
                                vm.scanResults = "Result text '" +resp.data+"'";
                              }
                            }, function(err) {
                              console.error('ERR', err);
                                // err.status will contain the status code
                              vm.succeedClass = "Orange";
                              vm.scanResults = err;
                            });
                        }
                        else {
                          vm.scanResults = "Invalid Matric Number";
                          vm.succeedClass = "Orange"; 
                        }

                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                        vm.succeedClass = "Orange";
                    });
            });
        };
    })
    
    .controller('ListController',function($scope,$http,List,RealList,eventName){
        $http.get(RealList.url+eventName.eventCode).then(function(resp) {
          $scope.list = resp.data.data;
          $scope.len = Object.keys(resp.data.data).length;
          
          $scope.doRefresh =function() {
            $http.get(RealList.url+eventName.eventCode).then(function(resp) {
            $scope.list = resp.data.data;
            $scope.len = Object.keys(resp.data.data).length;
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
