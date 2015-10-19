angular.module('scanner.controllers', ['ionic','jett.ionic.filter.bar'])

  .controller('HomeController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform,$http, $timeout) {
        var vm = this;
        vm.scanResults = '';
        vm.succeedClass = 'Normal';
        $scope.app={};
        var eventName = "event1";

        $scope.getManual = function() {
          if($scope.app.matric){
              $http.get("http://172.21.147.177:8000/register/"+eventName+"/"+$scope.app.matric).then(function(resp) {
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
                    vm.scanResults = "Please enter something!";
                    vm.succeedClass = "Orange"; 
          }
        };

        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        $http.get("http://172.21.147.177:8000/register/"+eventName+"/"+(result.text+Math.floor(Math.random() * 10000) + 1) ).then(function(resp) {
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

                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                        vm.succeedClass = "Orange";
                    });
            });
        };
    })
    
    .controller('ListController',function($scope,$http,List,RealList){
        var eventName = "event1";
        $http.get(RealList.url+eventName).then(function(resp) {
          $scope.list = resp.data.data;
          $scope.len = Object.keys(resp.data.data).length;
          
          $scope.doRefresh =function() {
            $http.get(RealList.url+eventName).then(function(resp) {
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

    .controller('LoginCtrl', function($scope, $state) {
        $scope.isInValid = false;
        $scope.user={};
        // $scope.adminLogin = function(){
        //   $state.go('adminLogin');
        // };
        // $scope.forgotPassword = function(){
        //   $state.go('forgotPassword');
        // };
        $scope.login = function(){
          if($scope.user.email== null || $scope.user.password == null){
            $scope.isInValid = true;
          }else if($scope.user.email === "user1@abc.com" && $scope.user.password === "user1"){
              $scope.isInValid=false;
              $state.go('tab.home');
          }else{
            $scope.isInValid = true;
          }
        }
      });
