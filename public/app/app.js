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
    
    // app.config(function($routeProvider) {
    //     $routeProvider
    //         .when('/login', {
    //             controller: 'LoginController',
    //             templateUrl: 'app/views/login.html'
    //         })
    //         .when('/register', {
    //             controller: "RegisterController",
    //             templateUrl: "app/views/register.html"
    //         })
    //         .when('/site', {
    //             controller: 'SiteController',
    //             templateUrl: 'app/views/site.html'
    //         })
    //        .when('/building', { 
    //            controller: "BuildingController", 
    //            templateUrl: "app/views/building.html"
    //        })
    //        .when('/floorplan', {
    //            controller: "FloorplanController",
    //            templateUrl: "app/views/floorplan.html"
    //        })
    //        .when('/sensor', {
    //            controller: "SensorController",
    //            templateUrl: "app/views/sensor.html"
    //        })
    //        .when('/edit_delete', {
    //            controller: "EditDeleteController",
    //            templateUrl: "app/views/edit_delete.html"
    //        })
    //         .otherwise( { redirectTo: '/login' } );
    // });

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
            .state("menu", {
                url:"/menu",
                views:{
                    'header':header
                }
            })
            .state('site', {
                url:'/site',
                views:{
                    'header':header,
                    'content':{
                        templateUrl: "app/views/site.html",
                        controller: "SiteController"
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
                        controller: "BuildingController"
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
                        controller: "FloorplanController"
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
                        controller: "SensorController"
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
                        controller: "EditDeleteController"
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
                        controller: "RegisterController"
                    }
                }
            }); 
       
    });
    
}());