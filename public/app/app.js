(function() {
    
    var fbconfig = {
        apiKey: "AIzaSyDfluu9dqHObXjxgyHOlGoxd7tOupzUYH4",
        authDomain: "tanand-demo.firebaseapp.com",
        databaseURL: "https://tanand-demo.firebaseio.com",
        storageBucket: "tanand-demo.appspot.com",
    };
    firebase.initializeApp(fbconfig);
    
    var app = angular.module('tanandApp', ['firebase', 'ui.router', 'ngRoute', 'ngCookies']);

    var header = {
       templateUrl: 'app/views/menu.html',
       controller: "MenuController"
    };

    app.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.when('', '/');
        
        $stateProvider
            .state("login", {
                url:"/",
                views:{
                    'content':{
                        templateUrl: "app/views/login.html",
                        controller: "LoginController"
                    }
                }
            })
            .state('site', {
                url:'/site',
                views:{
                    'header':header,
                    'content':{
                        templateUrl: "app/views/site.html",
                        controller: "SiteController",   
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            })
            .state('building', {
                url:'/building',
                views:{
                    'header':{
                        templateUrl: "app/views/menu.html",
                        controller: "MenuController"
                    },
                    'content':{
                        templateUrl: "app/views/building.html",
                        controller: "BuildingController",
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            })
            .state('floorplan', {
                url:'/floorplan',
                views:{
                    'header':{
                        templateUrl: "app/views/menu.html",
                        controller: "MenuController"
                    },
                    'content':{
                        templateUrl: "app/views/floorplan.html",
                        controller: "FloorplanController",
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            })
            .state('sensor', {
                url:'/sensor',
                views:{
                    'header':{
                        templateUrl: "app/views/menu.html",
                        controller: "MenuController"
                    },
                    'content':{
                        templateUrl: "app/views/sensor.html",
                        controller: "SensorController",
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            })
            .state('editDelete', {
                url:'/editDelete',
                views:{
                    'header':{
                        templateUrl: "app/views/menu.html",
                        controller: "MenuController"
                    },
                    'content':{
                        templateUrl: "app/views/editdelete.html",
                        controller: "EditDeleteController",
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            })
            .state('register', {
                url:'/register',
                views:{
                    'header':{
                        templateUrl: "app/views/menu.html",
                        controller: "MenuController"
                    },
                    'content':{
                        templateUrl: "app/views/register.html",
                        controller: "RegisterController",
                        resolve: {
                            factory: checkRouting
                        }
                    }
                }
            }); 
       
    });
    
    var checkRouting = function ($location, $cookieStore, webServiceFactory, $q) {

        var jwt = $cookieStore.get('jwt');
        var deferred = $q.defer();

        webServiceFactory.resolveToken(jwt).then(function(response) {
            var bool = response.headers('Forbidden');
            if(bool === "false") {
                deferred.resolve(true);
            } else {
                deferred.reject();
                $location.path('/');
            }
        });

        return deferred.promise;

    }
        
}());